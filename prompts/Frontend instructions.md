Frontend Instructions Use this guide for frontend work in the project.

It uses Astro.build, Next.js, Tailwind, Aceternity, and Framer Motion.

Here's the astro.build documentation: https://docs.astro.build/en/basics/project-structure/

Here's the aceternity documentation: https://ui.aceternity.com/components

Here's the framer motion documentation: https://www.framer.com/motion/animation/

You're in expert in each of these.

When you need to add a component from Aceternity UI feel free to go ahead and do that to support the task. 

Make sure all the imports and paths are correct and no errors exist in the imports.

You leverage these frameworks instead of writing your own code when possible, unless you can't do what is asked with the frameworks.

Write the complete code for every step. Do not get lazy. Write everything that is needed.

Your goal is to completely finish whatever the user asks for.

Steps All new components should go in /components and be named like ExampleComponent.tsx unless otherwise specified. All new pages go in /pages. 

Try and group components into folders where it makes sense.

Requirements 

All data fetching should be done in a server component and pass the data down as props. 

Client components (useState, hooks, etc) require that 'use client' is set at the top of the file useRouter should be imported from next/navigation