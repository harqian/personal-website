---
title: "vibe coding manifesto"
date: "2026-03-21"
tags:
    - ai
    - coding
    - agents
    - writing
published: true
---

## table of contents

- [definitions](#definitions)
- [disclaimers](#disclaimers)
- [rough current capabilities](#rough-current-capabilities)
- [principles](#principles)
    - [principle 1: leverage](#principle-1-leverage)
    - [principle 2: good tools/skills, not many tools/skills](#principle-2-good-toolsskills-not-many-toolsskills)
    - [principle 3: task description is unstructured](#principle-3-task-description-is-unstructured-llms-are-good-at-infering-meaning--structure)
    - [principle 3.5: get agents to do everything they can](#principle-35-get-agents-to-do-everything-they-can-your-time-is-valuable-this-is-an-application-of-changing-agentsmd-for-leverage-in-principle-1)
    - [principle 4: category of fresh new agent per dev task](#principle-4-category-of-fresh-new-agent-per-dev-task-context-management)
    - [principle 5: be disciplined](#only-if-you-want-to-be-non-vibey-principle-5-be-disciplined)
- [very good tips & tricks](#very-good-tips--tricks-only-the-best-should-just-do-all-of-these)
- [resources](#resources)

<div id="definitions"></div>

# definitions

## "agent" can be claude code, codex, gemini, cline, opencode, whatever; fundamentally all of these are agents (llms in harnesses designed to complete tasks autonomously)

## "context" means what is fed into the agent as input

## "AGENTS.md" (or CLAUDE.md or whatever) is a file that gets loaded into agent context every chat at the beginning (you just dont see it)

- there is a root version and a project version, root version is loaded everywhere and project is only loaded when you are in that project

## "vibe coding" isnt all vibe, can decide how vibey you want

vibey = not looking / not caring about infra & design

opposite of vibey is agentic (play on words, using agents but also smart about how you are using them, hitting a goal with discipline)

the only difference between them is how much human in the loop you have

- could be reading code (although code is inneficient)
- most likely reading spec & research, checking things, doing tests

its the difference between

- wow amazing i made a personal website and now i deploy it 🤩👍 (spent 1h)
- mid sized production ready app with connectors wired that i tested and iterated on and spent 3d on

<div id="disclaimers"></div>

# disclaimers

## *i have no idea how much you learn about coding while vibe coding*

- in principle if you read through all the stuff and really care, you should understand stuff?
- but there is something about writing the code that is a different educational experience because you actually see what works and what doesnt work; it allows for basically no misconceptions

i think you do learn a lot about how to vibe code / manage people though (agents ≈ drunk swe with infinite time?)

## *i have no idea how much energy/water these things use, it might be a lot?*

<div id="rough-current-capabilities"></div>

# rough current capabilities

things ive made:

- in minutes, scripts for automation
- in days, small production ready apps (other people have done this hella)
- in hours, medium scale simulations

things it can do (if you do it right):

- one shot entire hosted full stack websites with domain name
- one shot desktop applications
- automate all of your socials (messages, email, linkedin, instagram, etc)
- run marketing analysis & implementation (take in hella csv, do analysis, suggest improvements)
- make videos (using a python lib)

basically:

- if it has the tools and its mechanically only a mediocre complex job, it can pretty much one shot it
    - sometimes its bad but thats just because you didnt fully convey what you wanted
- things very complex need more structure & hand holding
- interfacing with non software things like hardware can be a bit tough

relationship between vibe coding experience, developer experience, time, and output:

- i feel that general dev experience is similar to vibe coding exepirence for the task of vibe coding
- specific dev experience pertaining to the task at hand is a big boost
- jump from beginner to intermediate for vibe coding exeprience ≈ general dev exeprience is very big
- more time ≈ more output until a certain limit where when a task is too complex it will take exponentially more time to complete a task that is epsilon more complex

<div id="principles"></div>

# principles

<div id="principle-1-leverage"></div>

## principle 1: leverage (2 layers above concrete)

(tangent: leverage also in many ways is the same as abstraction; like you are abstracting from code to a description of the code you will generate; in some ways a category of the code)

the core idea is this:

![leverage graphic](/writing-assets/vibe_coding_manifesto/leverage-graphic.png)

- this is a nice abstraction but
    - in reality there is another tradeoff here which is looseness of specification, e.g. 1 plan could have a buncha different codes, 1 research could have a buncha different plans
        - there is this hypothesis that at some point when coding agents get very good, there will be a single best way to generaet code from a plan, and thus this problem will be solved
            - (code will become artifacts generated from plans just like output files like visualizations or compiled binaries from compiled languages are artifacts generated by the code)
        - right now this is not the case, so the more you go up the chain the more that can go wrong if you arent looking at the path from where you are to the code itself (which is what matters)
    - also the hierarchy has issues
        - not direct transfers & not even good accurate mechanistic descriptions
        - e.g. claude.md doesnt that directly impact specification etc

**thus imo what the most solid is the layer of abstraction from code to spec; its a good tradeoff between leverage and risk from looseness**

### the easiest and most common example of this is spec driven development (1 layer above concrete)

example: tell agent to make plan

good way to implement spec driven dev:

![spec driven development graphic](/writing-assets/vibe_coding_manifesto/spec-driven-development.png)

### another less common but equally strong strategy is to chat with it so that you can make sure it knows what you want

e.g.

- \["ask me questions about what you are unsure about"] OR \["tell me what you think the idea is"]
- the second thing is functionally equivalent to a plan, but less rigorous

### another less common thing but definitely strong is to put some important structure or idiosyncracy info in the project AGENTS.md

- e.g. all the important scripts are in path/to/important_scripts/ and normie useless scripts are in scripts/
- or hey were using prisma db and for that you have to run this command `prisma migrate dev` every time you cahnge the db schematic

<div id="principle-2-good-toolsskills-not-many-toolsskills"></div>

## principle 2: good tools/skills, not many tools/skills

issues with many tools/skills

- context window jumbling -> increased confusion
- they might think certain tools are to be used but they arent actually good
- some agents/tools combinations are good where only the description of the skill is loaded and when the model uses it, then the entire thing gets loaded
- other times its not as good and all the instructions on how to use every tool are dumped into the initial prompt

a good strategy is to only enable the tools that would be needed (a bit annoying though)

### good tools

agent browser
mgrep (decent)
mcp servers for connections to services like

- hostinger
- supabase
- vercel
- railway
- cloudfare (although this one is so bad and annoying, idk how to set it up for the life of me)
- github

are very convenient

context7

you can imagine things like google drive, slides, docs, gmail, canva, discord, etc etc could be useful

### good skills

front end dev; instructions for how to make good clean website design
security guidance

<div id="principle-3-task-description-is-unstructured-llms-are-good-at-infering-meaning--structure"></div>

## principle 3: task description is unstructured, llms are good at infering meaning & structure

just have to get the idea across

- paste in convos youve had with people
- describe with vibey words / images and specify that you dont want this specifically but you want this vibe
- paste in pictures of the ideal thing
- ask agent to give you options

<div id="principle-35-get-agents-to-do-everything-they-can-your-time-is-valuable-this-is-an-application-of-changing-agentsmd-for-leverage-in-principle-1"></div>

## principle 3.5: get agents to do everything they can, your time is valuable (this is an application of changing AGENTS.md for leverage in principle 1)

e.g. (in AGENTS.md)

Key differences between Harrison and Claude:

- **Claude scales cheap.** If Claude *can* do something, Claude should do it. Harrison's job is largely enabling Claude to create value.
- **Claude's time is cheap and fast.** Prototyping makes sense in situations it wouldn't have before Claude existed.
- **Claude lacks context by default.** Every task is Claude's "first day." Memory lives entirely in docs, code, and prompts. Getting Claude the right context is critical.
- **Claude has limited tools.** A human can use a full computer; Claude is generally limited to CLI and whatever tools are set up. This makes staying grounded harder.
- **Claude can run long projects autonomously** - but only if set up right.

**After making a change, verify it worked** - like an excellent engineer would. Don't move on assuming it works.

- Wrote code -> run it, run tests, import it
- Fixed a bug -> reproduce the original failure, confirm it's gone
- Added an API endpoint -> `curl` it, check the response
- Started a server -> hit the endpoint
- Deployed -> hit the live URL

**always fully verify the functionality** unless it would take a long time or a lot of work (e.g. if it is a training script or would take building an entire testing suite)

- a visualization script should be fully tested and examined until correct
- manual verification should mean a human can look at an output and judge it directly
- if verification would require the human to write scripts, run ad hoc diagnostics, or gather data manually, that is not manual verification; turn that into automatic verification instead
- when you need small one-off scripts for verification, keep them out of the main implementation paths; place them in a clearly segregated sanity-check, validation, or verification area off to the side
- manual verification instructions must point to exactly where to look: the generated file, report, screenshot, URL, UI surface, or command output that already exists, along with what should look correct

**If you don't know how to verify** but think it should be verified, suggest a tool or capability that would let you verify it yourself - and offer to build it.

**At the end of each message, report:** what you verified and what you couldn't verify. There's always stuff that's hard to verify - that's normal, not a failure. Knowing what wasn't verified is just as valuable as knowing what was. Don't hide gaps; surface them so we can address them together.

<div id="principle-4-category-of-fresh-new-agent-per-dev-task-context-management"></div>

## principle 4: category of fresh new agent per dev task (context management)

start a new agent per dev task because when context gets full, agents get stupid

- for conversations, new messages are literally generated by feeding the entire chat history to the model

fill the context with what the problem is, codebase structure, and specs/tools (principle 2) for how to code/do the thing (principle 1)

<div id="only-if-you-want-to-be-non-vibey-principle-5-be-disciplined"></div>

## (only if you want to be non-vibey) principle 5: be disciplined

for beginners this means work on one feature at once; for experienced vibe coders this means being intentional about when to speed up (parallelize) and when to slow down (fine tune)
use source control (git / github)
tests

<div id="very-good-tips--tricks-only-the-best-should-just-do-all-of-these"></div>

# very good tips & tricks (only the best, should just do all of these)

- ## use some dictation tool for describing what kinds of changes you want; much faster than typing
    - there are so many but the best ones are
        - mac builtin
        - voice flow (can sit on the free tier and get good usage)
        - voice os (same thing)
        - whisperer for free + open source which means they probably arent training on your data
    - for reference here are all the ones i know (because its fun to list them):
        - mac builtin, whispr flow, voice os, aqua voice, willow, super whisper, whisperer (open source & free!), macwhisper)

- ## there is a good set of research/plan/implement prompts that are useful
    - from [here](https://github.com/humanlayer/humanlayer/tree/main/.claude/commands): the ones i use:
        - research_codebase
        - create_plan
        - implement_plan
        - create_handoff
        - resume_from_handoff

- ## because often times good vibe coding looks like prompt -> wait 1-5m -> prompt, its good to have something to do in between
    - if friends are nearby, chatting is amazing
    - get up and drink water, play an instrument, meditate, write up the next prompt, read over some docs, etc etc
    - watching the log of it working is not useful

- ## controlling its output is useful because it often is the only window into the code; also output tokens cost money & count towards context
    - something like "don't explain what you're doing, just do it, only ask me questions when you're genuinely blocked on a decision that matters" is pretty good
    - a good for this prompt is [this](https://github.com/anthropics/claude-code/blob/main/plugins/explanatory-output-style/hooks-handlers/session-start.sh)

<div id="resources"></div>

# resources

cool 2026 anthropic report on development trends with agents: https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf

where the leverage graphic and research plan implement graphic are from, lots of good stuff and framing: https://www.youtube.com/watch?v=IS_y40zY-hc

pretty good framework: https://github.com/obra/superpowers

good framing: https://simonwillison.net/2025/Dec/18/code-proven-to-work/

stuff on verification: https://engineering.ramp.com/post/why-we-built-our-background-agent

good principles: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

a claude code plugin for a good feature development workflow: https://github.com/anthropics/claude-code/tree/main/plugins/feature-dev

a good guide on claude code specific tips & tricks that are pretty good: https://github.com/affaan-m/everything-claude-code

some other good tips and tricks and app recs: https://github.com/tmad4000/vibe-coding-guide

cool resource for learning claude code for beginners: https://github.com/shareAI-lab/learn-claude-code

agents / skills that are good for different jobs in a business: https://github.com/msitarzewski/agency-agents

beginner intro to claude code (may 2025, pretty basic but covers the fundamentals): https://www.youtube.com/watch?v=6eBSHbLKuN0
