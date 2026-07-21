---
title: "One Unstable World to Many Stable Worlds — Building a Multi-Tenant Dev Environment"
description: "Every 3 days a new payment app springs up."
comments: true
keywords: "engineering, platforms, process"
published: false
---
Every engineering org that grows eventually hits the same bottleneck: testing changes in a shared dev environment becomes unreliable very quickly. Everyone deploying to the same environment means everyone stepping on each other's data. When the frequency of deployments ticks up, the problem gets worse. With AI, people are able to create features faster, and it will continue to get worse. After each feature, you typically want to test a flow end to end, but someone else's test just mutated the state you depended on while you were testing. Such an environment earns a reputation for being unstable, and nobody trusts it.

This will typically spark demand for isolated environments, and it has happened [where I work](https://upvest.co) in multiple ways, on different forums. The ask is always the same. How do I spin up a full copy of the system, mutate it however I want, throw it away, and get a fresh one, without affecting anyone else?

Some context on what "the system" means here. We run a microservice architecture on Kubernetes, with multiple teams owning several services, each with a single delegated task. We also depend on a Postgres database, Kafka, a secrets vault and most things you would find on a modern cloud-native platform. Let's call the whole running system a world. No service in it works alone: any critical flow cuts across many of them. One of many critical flows is [straight-through order processing](https://en.wikipedia.org/wiki/Straight-through_processing) : everything that happens between a customer clicking buy and the platform confirming the stock is theirs. A single order touches a good number of services end to end. If that path breaks, the business feels it immediately. And when an engineer says they want to test their change properly, this is usually the flow they mean, which makes it exactly the thing a shared environment is worst at.

Testing that flow in isolation is worth a lot, today. The first reason is smoke tests. A test that runs the chain end to end for every pull request, from any of the services involved, massively increases confidence in the change you are about to unleash. Without isolation, that confidence comes slowly: you deploy through shared stages and watch your work crawl through the pipeline before you learn anything. An isolated world collapses that loop to seconds, and that is a powerful thing a platform engineer can hand to product engineers. The second reason is load testing. You want to bootstrap a world, seed it with a particular scenario, and run a load test that targets a specific use case. If you do not seed a version of the world, your results rely on whatever data happens to be in place, and that comes with problems of its own. Runs stop being comparable, because the data shifted underneath them, and the accumulated junk looks nothing like production, so the numbers describe the leftovers from previous runs, rather than the system.

But the reasons go beyond what we can do today. The most valuable version of this tool is not one that runs the system as it is, but one that lets you inject your own changes, your branch, your local image, into a running world and test against everything else. That is a major hassle today, and it is exactly what a disposable world makes cheap. And one reason only became obvious recently: agents. Long-running agentic workflows are blocked by the same shared environments humans are. An agent that wants to validate its own changes needs a human in the loop before it can touch anything shared, and that human is the bottleneck. Give the agent a disposable world and the verification loop closes without anyone babysitting it. Agents need sandboxes even more than humans do.

So I set myself a deliberately idealistic goal. I should be able to run multiple parallel worlds, each involving many microservices, side by side, ideally on my laptop, sharing infrastructure but with fully isolated data planes. Data generated in world A must never leak into world B.

This post is about the four main problems that stood between me and that goal, and how I solved them.

## Why now

Among other internal factors, one thing changed fundamentally: the cost of building tools like this has collapsed, and AI is the reason. It also helps that I have [a pretty handy AI budget](https://upvest.co/blog/building-with-ai) that makes experiments like this possible.

Think about the traditional economics of a project like this. An isolated environment tool touches Kubernetes, databases, secrets infrastructure, and Kafka internals. Under the old model that is a multi-quarter effort. Design documents, reviews, prototypes, more reviews, and months of iteration before anyone can touch a working version. Projects like this rarely die because they are bad ideas. They die because the upfront cost never clears the bar against everything else competing for engineering capacity. That is why demand can sit unanswered for years.

AI changed the shape of that cost curve. I sat down with an AI assistant, had it help reason through each implementation one after the other, and iterated. Try an approach to TLS termination, watch it fail, understand why, try the next one, all within an afternoon instead of a sprint. I never left the model to run amok or reduced it to result delivery. I was constantly the human in the loop, stubbornly intentional and deliberately slow about design choices. The decisions remained mine while the drafts got cheap. The expensive part of building software has always been the iteration loop: the time between having an idea and learning whether it survives contact with reality. AI compresses that loop brutally. A few weeks of this, and I had a working system spanning four domains that would each have been a project on their own.

An interesting consequence is not that a tool got built faster. It is that a whole class of projects that used to be economically unjustifiable is now viable. If there is an internal tool your team has wanted for years, the math may have changed. It is worth rerunning the numbers.

But I digress.

## The core

The naive approach is to duplicate everything per world, just like we have in our current setup. Every database, every broker, every secret store, cloned for each environment. That is slow, ridiculously expensive, and does not scale.

So I flipped it on its head. Share all the infrastructure, and make every layer multi-tenant. One Postgres. One Kafka. One secrets endpoint. Each world gets a partitioned slice. This is to be a fresh, self-contained stack, stood up once per machine. The infrastructure can be as simple as docker-compose; the tool's job is to provide the rails for bootstrapping isolated worlds on top.

There is one constraint I fought hard to keep: services must not know any of this is happening. No code changes. No tenant awareness. No forcing teams to adopt a particular client library. If a service needs modification to run in a world, the design has failed. Adoption dies the moment you put homework on someone else's desk.

To that end, there were four main problems I had to solve: manifests, databases, secrets, and Kafka.

## Manifests

Production Kubernetes manifests are built for high availability. [Autoscalers](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) , [PodDisruptionBudgets](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) , service mesh sidecars, observability agents, generous resource requests. None of that matters for a throwaway dev world, and most of it actively fights you in a local dev environment.

So I strip manifests to the bare bones. Autoscalers and disruption budgets are removed. Replica counts are forced to one. Resource requests are set to cluster defaults, so nobody gets to ask for twelve CPUs. The mesh sidecar goes. The observability agent goes, for now, though I suspect putting logs and metrics back in a dev-friendly form will be a real quality of life win later.

I set this up as a transformation pipeline. Source manifests go in one end, an ordered series of transformations runs over them, and stripped-down dev manifests come out the other. That decision paid for itself. A pipeline is testable and tested, each transformation is composable, and when a later problem needs something injected into every manifest, the injection is just one more stage. It shows up again twice below.

What is left is a deployment, a service, and the external secrets the service depends on. Deploy that into a local [kind](https://kind.sigs.k8s.io/) cluster and it works out of the box.

## Postgres

In production, each service effectively gets its own managed Postgres instance, with backups, failover, and authenticated access. For local dev you need none of it, and duplicating an instance per service per world is a non-starter.

The nice thing is that Postgres is already multi-tenant by design, and it gives you two units of tenancy to choose from. The obvious first stop is [schemas](https://www.postgresql.org/docs/current/ddl-schemas.html) : one database, one schema per world, table names stay stable, and `search_path` does the routing. It was the first thing I tried, but that did not work. Some services ship migrations that point explicitly at the `public` schema, and that assumption runs deep. Fixing it means changing services, and changing services is against the rules.

So I went one level up. The unit of tenancy became the database name, which no service ever references in code ... yet. It arrives through configuration, which makes it the one knob I can turn without anyone noticing. I run one Postgres instance, and every world gets its own set of databases, prefixed with the world name. World A gets `world-a.service-x`. World B gets `world-b.service-x`. Both live side by side.

Services already take their connection settings from environment variables: host, user, password, database. Injecting the prefixed database name per world is just another stage in the manifest pipeline from above, and requires zero code changes. Two worlds on one instance, and neither is any the wiser.

## Secrets

This was one of the harder problems. But in the end, the solution was incredibly obvious. Services fetch secrets from the cloud provider's Secret Manager, either through the SDK or through [Kubernetes External Secrets](https://external-secrets.io/) . Both paths hit the same public endpoint, over TLS, authenticated with cloud identity.

You cannot point that at localhost. Or can you?

The trick was a three-layer fake. First, DNS. Inside the local cluster, we rewrite DNS so the Secret Manager hostname resolves to a [secrets emulator](https://github.com/blackwell-systems/gcp-emulator) instead of the real cloud API.

Second, TLS. The SDK expects a valid TLS handshake, and the emulator does not speak TLS. So the setup creates its own root certificate authority, appends it to the trust store of every pod it ships, as part of the pipeline, and uses it to issue a certificate for the Secret Manager hostname. Every pod now trusts the fake endpoint, because we made it so.

Third, gRPC. Secret fetching happens over gRPC, so after terminating TLS you forward the gRPC traffic to the emulator.

All of this is nginx configuration.

The service calls the same hostname it calls in production, gets a valid handshake, speaks gRPC, presents the same credentials it always presents, and receives its secrets. It never learns that everything behind the hostname is fake. As a bonus, that internal CA became a reusable building block. Once you can issue certificates that every pod trusts, you can impersonate any TLS endpoint you need to mock. It shows up again in the next section.

## Kafka

Kafka is fundamentally not multi-tenant. There is one global topic namespace per cluster. Create `topic-a` and everyone on the cluster sees `topic-a`.

[The official Kafka guidance](https://kafka.apache.org/documentation/#multitenancy) is to prefix all topics with a tenant identifier and enforce it with policies. Fine, except our services are not tenant aware, and by my own constraint they are not allowed to become tenant aware. So something has to sit between the service and Kafka and do the tenancy transparently.

I had four requirements for that something. A single shared broker, with no tearing infrastructure down and up per tenant. Support for the actual Kafka wire protocol, not just produce and consume but metadata, offset commits, and transactional IDs. Light enough to run alongside everything else. And licensing that does not require a procurement conversation for an experiment.

I evaluated what the market had. [Kroxylicious](https://kroxylicious.io/) was the most viable option I found. It is open source and works as designed, but it runs on the JVM and kept getting heavy next to everything else. [Conduktor Gateway](https://www.conduktor.io/gateway/) is easier to use, but the features I actually needed sit behind an enterprise license, and an experiment is not the time for that conversation. The third option, making services tenant aware, is technically the correct answer and my least favorite. It forces an opinion on every team, requires everyone to adopt a specific client library, and means waiting for org-wide adoption before the tool works at all.

Having worked on some large-scale Kafka deployments in the past, and with some [experience in encoding formats](https://github.com/bubunyo/bogo) , I rolled up my sleeves and, with a touch of madness, wrote my own. I called it kroxy. It started as a weekend project, and is internal for now.

kroxy does one thing. It sits between the service and Kafka, figures out which tenant a connection belongs to, rewrites topic names with the tenant prefix on the way in, strips the prefix on the way out, and proxies everything else untouched. Transactional IDs get the same treatment, because Kafka transactions carry identifiers of their own. No ACLs, no permissions, no event hooks, none of the enterprise features the market proxies offer. Transparent tenancy rewriting at the protocol level, and nothing else.

When you start a world, a provisioner registers the tenant with kroxy and creates the prefixed topics on the real broker. Connection settings are injected as part of the manifest transformation pipeline, in the shape each service already expects. A service asks kroxy for `some-topic`. kroxy translates that to `world-a.some-topic`, talks to the shared broker, and translates back on the response. The service believes it is talking to a normal Kafka with its normal topics.

This is also code that cannot be quietly wrong. kroxy sits on the wire protocol, exercised by every client on every request. Implementing it carefully went a long way toward making bugs easy to track down and fix. Of which there were a few.

It worked.

## Running it

I started on my laptop, and for a handful of services it was fine. But a full world in our setup is over a hundred services, and by the end it was clear the complete stack was too heavy for the machine I type on. You can run it. You will not enjoy it.

So I ported the implementation to a VM in Google Cloud with [Packer](https://developer.hashicorp.com/packer) and [Terraform](https://developer.hashicorp.com/terraform) , and designed the split deliberately: your laptop remains the authoring surface, the VM becomes the backend. You write, the VM runs. The binary syncs over, and the whole stack lives there under systemd: kind for service container orchestration, plus containerized Kafka, Postgres, the secrets emulator, and kroxy, managed with [nerdctl](https://github.com/containerd/nerdctl) as a replacement for docker compose.

The end state is four commands. Two to build and start your VM, one to initialize the stack, one to spin up a world. After the first run, spinning up a new world is a single command.

This is v1. I foresee it evolving to a unified setup where a big cluster hosts all worlds and dedicated providers back all shared infrastructure. But for now, this works.

## What I did not build

Scope discipline was half the project.

The obvious end game is PR preview environments. Open a pull request, get a world, see the URL in the PR. Everything above paves the road there, but that feature drags in CI, compute capacity, and provisioning questions that have not been answered yet. The aim was to test the idea by figuring out the building blocks first.

Data seeding is the other gap. An empty environment is not that useful. You need baseline data before you can exercise anything real. It is a real problem, it is on the roadmap, and I have intentionally not solved it yet.

And worlds are throwaway by design. So updating one is as simple as throwing what you currently have away and conjuring a new one, which always reflects the current state of the system. Throwaways also keep the blast radius honest: the worst any bug can do is break a world you were going to delete anyway. Migrating a lingering world forward is a convenience feature for later, if ever.

## The takeaway

If you take away nothing else from this, remember: multi-tenancy beats duplication, and transparency is the design constraint that decides adoption. Every solution above, the database prefixes, the fake Secret Manager, kroxy, exists so that services stay completely unaware they are living in a partitioned world. And AI is making experiments like this cheaper to run.

The next time someone tells you an environment cannot be isolated without cloning everything, ask which layer is actually not multi-tenant. The answer is usually shorter than the excuse.

We are always looking for interesting people to solve interesting problems with. If that is you, [Upvest is hiring](https://upvest.co/careers) .
