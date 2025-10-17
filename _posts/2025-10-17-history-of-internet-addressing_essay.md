---
layout: post
title: "Redis"
description: "The day the Internet run out of addresses"
comments: true
keywords: "internet, ipv4, ipv6"
published: true

---
In 1981, Jon Postel handed out /8 blocks like they would last forever. Take 16 million addresses, he said. We will never run out. MIT took one. So did Ford, IBM, and a few dozen others. By 2011, IANA gave away the last block. Postel had been dead for 13 years.

This is how we got here. How the internet went from abundance to scarcity. From Postel's paper notebook to IP address marketplaces. From end-to-end connectivity to NAT traversal hell. It is a story about optimism meeting reality, about choosing convenience over architecture, and about how technical debt compounds across decades.

## The Age of Abundance (1981-1990)

When [RFC 791 standardized IPv4](https://datatracker.ietf.org/doc/html/rfc791) in September 1981, the internet was tiny. We are talking about connecting research institutions and military networks, not billions of smartphones. The 32-bit address space seemed infinite. 4.3 billion addresses for a network that had maybe a few hundred hosts.

Jon Postel, one of the internet's founding architects, managed address allocation with what legend describes as a paper notebook. There were no contracts, no formal procedures, just an informal understanding that you would do the right thing for the good of the internet. If you needed a network number, you asked Jon. He would write it down and that was that.

The classful addressing system introduced in RFC 790 divided the address space into three classes. Class A networks got a /8, 16.7 million addresses each. Class B got /16 blocks with 65,536 addresses. Class C got /24 blocks with just 256 addresses. The assumption was straightforward: big institutions get big blocks, smaller ones get smaller blocks.

[MIT got 18.0.0.0/8 in 1979](https://superuser.com/questions/1152954/why-does-mit-have-a-8-ipv4-block), before classes even existed. Stanford got one. So did [companies like IBM, Ford, and Apple](https://www.pingdom.com/blog/where-did-all-the-ip-numbers-go-the-us-department-of-defense-has-them/). The US Department of Defense ended up with multiple /8 blocks. When you are building something new and the pool seems bottomless, why not be generous?

Here is the thing though. Even then, some people knew this would not scale forever. The decision to use 32 bits was not arbitrary. It was a tradeoff between header size and address space. But in 1981, the idea that we would have billions of connected devices seemed like science fiction. The practical concern was getting the damn thing to work at all.

## The First Cracks (1990-1993)

By 1990, the cracks started showing. The [IETF's Network Working Group noted](https://sites.google.com/site/internethistoryasia/book2/section-7-2-apnic) that with rapid escalation in the number of networks and concurrent internationalization, address allocation needed serious rethinking. Class A and B addresses were becoming an increasingly scarce commodity whose allocation must be handled with thoughtful care.

The problem was twofold. First, classful addressing was wasteful. If you needed 2,000 addresses, you would get a Class B with 65,536 addresses and waste 63,000 of them. Or you would get eight separate Class C blocks and fragment the routing table. Second, the routing table was growing faster than routers could handle.

In [RFC 1338 published June 1992](https://datatracker.ietf.org/doc/html/rfc1338), the IETF proposed supernetting, what would become CIDR (Classless Inter-Domain Routing). Instead of fixed-size classes, you could allocate any power-of-two block size using variable-length subnet masks. A /20 here, a /22 there, sized to actual needs. It was elegant, it was flexible, and it bought us time.

But CIDR was a bandaid. It made allocation more efficient and helped with routing table growth, but it did not solve the fundamental problem. We were still burning through a finite address space, just more slowly.

## The NAT Compromise (1994-1998)

This is where we made a choice that still haunts us. In [May 1994, RFC 1631 introduced Network Address Translation](https://datatracker.ietf.org/doc/html/rfc1631). The idea was simple: use private address space internally (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) and translate to public addresses at the network edge.

NAT was supposed to be a temporary workaround. It became doctrine.

With NAT, suddenly you did not need public addresses for every device. One public IP could serve hundreds or thousands of internal hosts. ISPs loved it because they could serve more customers with fewer addresses. Network admins loved it because it simplified management. Security folks loved it because it added a layer of obscurity, though not real security, despite what people still claim.

But NAT broke the internet's end-to-end principle. The original design assumed any host could directly communicate with any other host. NAT made that impossible. Want to run a server from your home connection? Good luck. Need peer-to-peer connectivity? Welcome to STUN, TURN, ICE, and a baroque collection of hole-punching techniques.

We spent the next 25 years building increasingly complex workarounds for a workaround. Every VoIP protocol, every P2P application, every WebRTC implementation, they all have to dance around NAT. We normalized brokenness and called it good enough.

Meanwhile, IPv6 was being developed. [The specification came in 1998](https://datatracker.ietf.org/doc/html/rfc2460), the same year Google was founded. It offered 340 undecillion addresses, enough to give every atom on Earth's surface a trillion IPs. It fixed NAT. It improved routing. It was everything we needed.

We did not deploy it.

## The Exhaustion Era (2008-2011)

By the late 2000s, the writing was on the wall. [IANA exhausted its primary address pool on February 3, 2011](https://en.wikipedia.org/wiki/IPv4_address_exhaustion), allocating the last five /8 blocks to the regional internet registries. APNIC ran out in April 2011. RIPE followed in September 2012. ARIN implemented a waiting list in 2015.

We knew this was coming for years. The predictions varied on timing, but nobody thought the IPv4 space would last indefinitely. Yet here we were, with IPv6 specified for over a decade and adoption still minimal.

Why? Inertia, mostly. IPv6 is not backward compatible with IPv4. You cannot just flip a switch. Every router, every firewall, every application that hardcodes IPv4 assumptions, it all needs updating. That is expensive. That is risky. That requires coordination across millions of independent actors.

And crucially, the people who controlled IPv4 address space had zero incentive to push migration. Why would they? Scarcity made their assets valuable.

## The Market Era (2011-Present)

When [Nortel sold IPv4 addresses to Microsoft in 2011](https://ipv4marketgroup.com/a-brief-history-of-ipv4/), something shifted. IP addresses became tradable commodities. Today, a single IPv4 address costs $40-60 on secondary markets. A /24 block goes for $10,000-15,000. That /8 MIT got for free in 1979? Worth nearly a billion dollars at market rates.

Stanford gave their /8 back to APNIC in 2000, apparently out of altruism. [MIT sold parts of theirs to Amazon in 2017](https://tech.slashdot.org/story/17/04/20/1316212/mit-no-longer-owns-180008). The regional internet registries now explicitly allow transfers subject to some conditions. We have financialized scarcity.

And here is the uncomfortable truth: this probably slowed IPv6 adoption. When AWS can charge for elastic IPs, when holding IPv4 space is a balance sheet asset, when entire companies exist to broker address transfers, the status quo works just fine for some very powerful players. Every "we will support IPv6 when our customers demand it" statement is just protecting rent-seeking infrastructure.

Meanwhile, we keep building workarounds. Carrier-grade NAT, where ISPs put entire neighborhoods behind a single public IP. IPv4-to-IPv6 translation layers. Dual-stack deployments where everything runs twice. We have made the simple act of addressing a device on a network into a multilayered complexity nightmare.

## Where We Are Now

IPv6 adoption sits around 40% globally as of 2025, which sounds decent until you realize we have had 27 years. Some countries are doing better. India is over 60%, driven by mobile carriers. The US hovers around 50%. But huge swaths of the internet remain IPv4-only.

The good news? We are past the tipping point. Major cloud providers run IPv6 internally and translate to IPv4 for legacy systems. Mobile networks deploy IPv6-only with translation for IPv4 destinations. New devices ship with IPv6 enabled by default. The migration is happening, just very slowly.

The bad news? We have wasted decades and billions of dollars on complexity we did not need. Every STUN server, every NAT traversal library, every dual-stack deployment, that is engineering effort that could have gone to solving actual problems instead of routing around artificial scarcity.

## What We Can Learn

This is not really a story about IP addresses. It is a story about how we respond when we hit resource limits. We had three options when IPv4 exhaustion became inevitable:

1. Migrate to IPv6 aggressively
2. Make IPv4 more efficient (CIDR, NAT)
3. Create markets to allocate scarcity

We chose options 2 and 3. We optimized the existing system and financialized the constraint. We did not choose option 1 until scarcity was already baked in and powerful interests had formed around maintaining it.

The pattern repeats everywhere in tech. When faced with fundamental limits, we tend to build increasingly complex workarounds rather than addressing root causes. Technical debt is not just about code. It is about architecture, about systems, about the compounding cost of deferred decisions.

But here is what gives me hope: the internet has always been surprisingly resilient. We have made questionable decisions, we have optimized for the wrong things, we have let institutional inertia win battles it should not have won. And yet the thing keeps working. It keeps growing. It keeps evolving.

IPv6 is happening. Not as fast as it should have, not as cleanly as it could have, but it is happening. In another decade, maybe two, IPv4 exhaustion will be a historical footnote. Kids learning networking will wonder why we ever thought 4.3 billion addresses was not enough. The NAT workarounds will fade into legacy systems nobody wants to maintain.

The internet's original sin was not using 32-bit addresses in 1981. That was a reasonable engineering tradeoff given the constraints. The sin was clinging to that decision for 30 years after we knew better. Not for technical reasons, we had the solution, but because changing course required coordination and someone not getting paid.

In the end, we are getting there. Just very, very slowly. And at tremendous unnecessary cost. But we are getting there.

---

*Further reading:*
- [RFC 791 - Internet Protocol](https://datatracker.ietf.org/doc/html/rfc791)
- [History of the Internet - APNIC](https://www.apnic.net/about-apnic/organization/history-of-apnic/history-of-the-internet/)
- [IPv4 Address Exhaustion - Wikipedia](https://en.wikipedia.org/wiki/IPv4_address_exhaustion)
- [Jon Postel: Architect of the Internet](https://www.historytools.org/people/jon-postel-complete-biography)
