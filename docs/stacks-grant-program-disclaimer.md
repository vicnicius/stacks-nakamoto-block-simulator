# Stacks Grant Program Disclaimer

This project is part of the Stacks Foundation Grant Program. It was one of the Critical Bounties published in the first quarter of 2023, and it was awarded $12.6k by the Stacks Foundation. You can find the Bounty description here: [Stacks-Grant-Launchpad/discussions/859](https://github.com/stacksgov/Stacks-Grant-Launchpad/discussions/859)

### The original proposal

The original proposal was sent in the form of a Notion doc. The original doc is here: Bounty Proposal: Stacks Nakamoto Block Simulator UI (notion.so). Below is the content of the document, reproduced in its final version.

{% code overflow="wrap" %}
```markdown

# Bounty Proposal: Stacks Nakamoto Block Simulator UI

**CB-2Q23-05.1**

# Summary

The Stacks Foundation is working on a new tool to help educate the community on the new forking rules that will be effective with The Nakamoto release. The project aims to provide an interactive visual environment (a web app) where they can better intuit how those new forking rules will work. In this document, I'll outline a proposal for such a tool. Since the educational scope will often go beyond the app itself, I will expand the project scope to more than just the web app but other activities that might be needed to support community education. Those should all be considered negotiable from a bounty perspective, especially given they might already be under the scope of other community members.

# Revision History

- March 29 - First version

# Problem Description

The Stacks Nakamoto release is a set of changes to the Stacks blockchain that will take the chain's relationship to the Bitcoin blockchain one step further while also enhancing its ergonomics.

> “The Nakamoto release adds important capabilities that enhance the power of Stacks as a Bitcoin layer. In addition to the trustless, two-way Bitcoin peg (sBTC), this release would enable transactions secured by Bitcoin finality and faster Stacks transactions between Bitcoin blocks.” 
*The Stacks Foundation Website*
> 

Among the changes coming with the release, the most critical ones relate to its security model. The Stacks blockchain will move from a separate security budget, supported by the BTC capital spent by miners, to having most of the chain secured by 100% of Bitcoin's mining power. 

Stacks will follow new block production and forking rules in this new model. Still, those rules are only sometimes straightforward, especially considering the different conditions and the diverse background of the various community members in the Stacks ecosystem. Yet, educating and giving educators tools to communicate how this upgrade will work is necessary. It is with this challenge in mind that this project comes to life.

## Proof-of-concept

 @radicleart did proof-of-concept work on creating a web app allowing users to see and interact with virtual blocks on the Stacks and Bitcoin's blockchains. The result can be found here: https://github.com/Trust-Machines/blocksim/

## Risks

### Providing the wrong information

The most significant risk is that the tool will wrongly convey some rules. This could be due to a misunderstanding of the new forking rules by the developer, outdated documentation, or bugs. Mitigating this risk will require thorough research and preparation work as well as a good process of validation.

### Not being usable

The tool itself needs to be more straightforward to use to be able to achieve its goal and could even make it worse. Mitigating this risk will involve getting valuable feedback as early as possible in the UI implementation phase.

### Not explaining well

If users still need to understand how those forking rules will work, the tool will only achieve its goal after using this web app. This could be because of issues in the tool UI/UX or mistargeting the audience, for example. Mitigating this risk will involve getting valuable feedback as early as possible in the Educational layer implementation phase and the community validation. I’ll make sure we have mechanisms to spot eventual misunderstandings coming from the usage of the application so we can work on solutions for them.

### Not being ready on time

The sooner this tool is live, the more time the community will have to understand the new forking rules better and to help improve the web app itself. Failing to have it ready in a reasonable time might represent a lost opportunity for better community alignment and communication.

# Proposal

## Overview

Below I outline a proposal for a web application that supports the education of Stacks community members on the new forking rules.

## Tech-stack

I suggest building this new web application in React. The prototype for this project was constructed in Svelte, which is a perfect tool for accomplishing it. Still, the most prominent community-driven tools in the Stacks ecosystem currently use React, like the Hiro wallet and the Stacks explorer. Keeping the same choice for this project should guarantee an easier time for regular contributors to onboard and help support this project as well. It should also make it easier to follow some of the same practices for lining, testing and deploying. Finally, React has a larger community and a more extensive set of plugins, tools and extensions that could help with this project's future building and maintenance. That said, if there's any strategic reasoning behind using Svelter instead of React, everything outlined in this proposal should be achievable with it as well.

Fabric can be the library of choice for the actual drawing and animation. 

## The App

We propose creating a web application that allows users to visualize and interact with virtual Stacks and Bitcoin Blockchains. The first version of the app will adhere to the following requirements, [as described in this document](https://docs.google.com/document/d/1Qvc6Av_xWvagdzXi6FOC9Z0d_p31czKPpL3Yp0bHYBs/edit):

- ConcealStacks View shows Stacks blocks with blocks of the same height in each row.
- Bitcoin View shows Stacks blocks with one block per row.
- Either or both views can be displayed at the same time.
- Clicking a block in either view should create the next block and draw the connecting line.
- The tool supports trees with heights of up to 50 blocks and up to 10 blocks wide.
- Operations:
    - create_block(parent_block) triggered by clicking on a block
    - There will be some mechanism to allow the triggering of more operations, such as:
        - freeze block
        - thaw block
        - conceal block
        - disclose block
- All the block creation and manipulation will be saved in a standardized JSON format.
- The tool can export and import the standard tree-state JSON file.
- The block state will determine the block's colour and the ability to create a block descending from it.
- The tool supports navigating across actions.
- The tool supports undo and redo actions.

The tool will also provide informational tooltips/modals in the relevant contexts and pointers to the appropriate documentation. This could be a tooltip shown when hovering over a specific action in the action visualization widget, or a modal is shown in another relevant area to help explain that concept further.

The tool will primarily focus on desktop devices to reduce complexity, but we can optionally work on a responsive version later.

It will have Stacks branding and follow the overall Stacks design language.

# Roadmap

An overview of how I plan to approach the project. As in every software project, the estimations should be taken with a grain of salt.

## Phase 1. Design and UI implementation

I’ll work on creating and refining the visual aspects of the web app. This will be an interactive process where I’ll generate refined prototypes and gather feedback from the key stakeholders to define how the UI will look and feel. The outcome of this phase is a static version of the web application with the main elements present. A workspace for the blockchains, the UX for triggering and manipulating actions, and the branding and design already applied.

**Estimation:**  ~40 working hours

## **Phase 2. Interaction Implementation**

Here I’ll connect the UI to its business logic. Some preparation work will be needed to double-check what is relevant or not on the prototype code and the available documented information regarding fork rules. The interaction with blocks, actions import and export, undo, redo, and animations will be implemented. With every section ready, I’ll share the prototype for testing with the relevant stakeholders for preliminary validation.

**Estimation:** ~60 working hours

## Phase 3. Education Layer additions

This phase will be about adding contextual information where relevant and validating it. It can also go beyond in some ways and ensure the current official documentation is up-to-date and appropriate for the audiences it plans to achieve. I’ll be responsible for creating the content and will work with stakeholders on the validation.

**Estimation:** ~20 working hours

## Phase 4. Testing, Alpha release to the community, and Feedback processing

Finally, the web app should be ready to be shared with the broader community. After it's released, I’ll work on final testing and validation and communicate and process all the community feedback. Of course, this will be an ongoing project later, but this estimation mainly addresses the first influx of feedback, which should have a more significant volume.

**Estimation:** ~20 working hours

# Estimation Summary

| Phase | Estimation in working hours |
| --- | --- |
| 1. UI implementation | 40 |
| 2. UX Implementation | 60 |
| 3. Education layer  | 20 |
| 4. Testing, releasing and working on early feedback | 20 |
| Total | 140 working hours |

## Ideas moving forward.

It would be cool if the tool could represent a simplified version of what’s happening live, for example. 

It could be further worked to support mobile devices very well.

## References

- Blockchain animation: [https://codepen.io/dok/pen/VBgPYO](https://codepen.io/dok/pen/VBgPYO)
- Mining simulator requirements: [https://docs.google.com/document/d/1Qvc6Av_xWvagdzXi6FOC9Z0d_p31czKPpL3Yp0bHYBs/edit](https://docs.google.com/document/d/1Qvc6Av_xWvagdzXi6FOC9Z0d_p31czKPpL3Yp0bHYBs/edit)
- Simulator live MVP: [https://trust-machines.github.io/blocksim](https://trust-machines.github.io/blocksim)
- MVP code: https://github.com/radicleart/blocksim
- Nakamoto Release white paper: [https://uploads-ssl.webflow.com/618b0aafa4afde65f2fe38fe/6399d5ca541ccc6c51882bed_stacks.pdf](https://uploads-ssl.webflow.com/618b0aafa4afde65f2fe38fe/6399d5ca541ccc6c51882bed_stacks.pdf)
- Bounty: [https://github.com/stacksgov/Stacks-Grant-Launchpad/discussions/859](https://github.com/stacksgov/Stacks-Grant-Launchpad/discussions/859)
```
{% endcode %}

