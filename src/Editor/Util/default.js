export const defaultContent = `# Welcome to function-notes 
A slightly more functional notes app... in some ways.

The goal of functionotes is to add basic calculation and coding capability straight in to your notes editor!

## calculating stuff 

the basic stuff you can do here is use the \`calc\` command

for example if you type \`calc(1+1)\` you will get calc(1+1)

you can do pretty much anything javascript can do, since it pretty much just runs your math in js

so you can do \`calc (Math.sin(1))\` and get calc (Math.sin(1))

## running code

you can also run code with \`eval {}\`

for example eval {{return 2+2}}

it'll run it like an arrow function, so \`() => whatever you put in your eval\`

so \`eval {2+2}\` is run as \`() => 2+2\`

as a result, if you want more complex code, you'll need more curly braces

here's an example:
eval {{
    let a = 1;
    a = a * 2;
    return a
}}
if your code ain't working, we'll let you know like this!

eval {foo-bar}

## using variables

you can simply assign variables like this \`test = 1\`

I'll do it here: test = 1

and that'll globally store a variable

and now I can retrieve it with \`getvar\` in our content: getvar test

I can also access it in javascript: eval {test * 2}

I can't just store calculations to variables, it'll see the calculation result as a string, here:

calcResult = calc (10+10)

getvar calcResult

instead I can do

goodCalcResult = eval {10+10}

and this'll work more like expected: getvar goodCalcResult
`