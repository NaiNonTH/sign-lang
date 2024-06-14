# Sign (Language)

Written in JavaScript, Sign is a [Brainfuck](https://en.wikipedia.org/wiki/Brainfuck) inspired programming language, designed to be another fancy way to say "Hello, world."

## Table of Contents:

* [Language Concept](#language-concept)
* [Language Syntax](#language-syntax)
  * [Signs](#signs)
    * [Sign Groups](#sign-groups)
    * [Barriers](#barriers)
    * [Duplicator](#duplicator)
  * [Output](#output)
  * [Labels](#labels)
  * [Jumps](#jumps)
    * [Conditional Jumps](#conditional-jumps)

## Language Concept

Inside of the Dash code, you will find lines of instruction, which can be separated into two parts: the **instructor** and the **expression**. The intepreter will use instruction pointer to mark the line that will be processed. Once it's processed, the expression will be parsed into a value first though **signs** inside it. Then, the intepreter will check the instructor to see what to do with the processed expression value.

```
| an example of Dash code that prints numbers from 1 to 10

#str       |
#end       ----------
#str       {str}-
>>         {str}
v(str|end) --
>          == ------
^(str!end) ----

| outputs "1,2,3,4,5,6,7,8,9,10"
```

## Language Syntax

### Signs

Signs are the only way to define a value. When they are tailed (connected) to each other, a Sign Group is formed along with the expression value being added by the sign's value.

There are four signs available in Dash:
* `.` = 0.1
* `_` = 0.5
* `-` = 1
* `=` = 25

```
>> ---. | 3.1  (1 + 1 + 1 + 0.1)
>> ===_ | 75.5 (25 + 25 + 25 + 0.5)
```

#### Sign Groups

Signs Groups are separated with a space (` `). When there are more than one Sign Groups in an expression, they will attack each other, subtracting the expression value.

```
>> == ----- | 45 ((25 + 25) + (1 + 1 + 1 + 1 + 1))
>> - -      | 0  (1 - 1)
```

#### Barriers

A pipe character (`|`) is used as a Barrier. When an intepreter encounters it, it will immediately move to the next instruction and ignore all types of Sign behind it.

```
>> =--|--      | 27 (25 + 1 + 1)
>> = --- | --  | 22 (25 - (1 + 1 + 1))
>> |           | 0
```

### Output

Dash uses Greater Sign (`>`) to output the value.

* If there's only one (`>`), it will convert the expression value into as ASCII character before printing.
* If there are two (`>>`), it will simply print that value as a number.

```
>  === ---  | H
>> === ---  | 72
```

### Labels

**Labels** or **Variables** can be used to store an expression value after finishing processing by using the tag (`#`) followed by the label name.

**NOTE:** Labels can't contain spaces (` `), as it will mix with a normal space that is used to separate instructor and expression.

```
#var === --- | var now contains 72
```

And if you want to call the label, you can use braces (`{`, `}`) with the variable name inside. You can also mutate the label value any time.

```
| .
| .
| .
>>   {var}    | 72
>>   {var} -- | 70

#var {var}--- | var now contains 75 instead of 72
>>   {var}    | 75
```

### Duplicator

Duplicator uses asterisk sign (`*`) for a multiplication towards a [Label](#labels). It will take the value of the Label name after it and multiply it with the Expression value.

```
#a =-   | a is 26
*a ---- | (26 * 4)
>> {a}  | prints 98
```

### Jumps

Jumps, similar to `goto` statement in other languages, is used to move the instruction pointer by the expression value from its current line:

* `^` will move the instruction pointer to the **upper** line.
* `v` will move the instruction pointer to the **under** line.

**DANGER:** Be cautious when using these; you may experience an infinite loop from them.

```
#a ==== ---
#n =--(----)--
> {a}
v ---   | line 1 skipped (skip by 3 lines starting from this line)
> {n}   | line 2 skipped
> {n}-  | line 3 skipped
> {n}   | instruction pointer will move to this line and execute it

| outputs "an"
```

Or, you can simply count the line up or down.

```
#a ==== ---
#n =--(----)--
> {a}
v ---   | start counting
> {n}   | count 1
> {n}-  | count 2
> {n}   | count 3 (instruction pointer will move to this line and execute it)

| outputs "an"
```

#### Conditional Jumps

When Jumps syntaxes are tailed by a parenthesis of two variables separated by `|` or `!` (`(a|b)` or `(a!b)`), they will turn into a **Conditional Jump**:

* If variables are splitted with `|`, the jump will occur if those variables are **equal** to each other.
* If variables are splitted with `!`, the jump will occur if those variables are **not equal** to each other.

```
#str       |
#end       ----------
#str       {str}-
>>         {str}
v(str|end) --         | will jump if 'str' is equal with 'end'
>          == ------
^(str!end) ----       | will jump if 'str' is "not" equal with 'end'

| outputs "1,2,3,4,5,6,7,8,9,10"
```