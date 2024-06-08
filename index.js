/**
 * @instance
 * @class
 * @classdesc Declare a new Dash Intepreter instance
 */
class Dash {
    constructor() {
        this.input = "";
    }

    #callInputWithClosure() {
        const input = this.input;
        let index = 0;

        return function() {
            if (index >= input.length)
                return 0;
            else
                return input.charCodeAt(index++);
        }
    }

    /**
     * Sets the input string
     * @param {string} input
     */
    setInput(input) {
        this.input = input;
        return this;
    }

    /**
     * Start Intepreting the Dash source code in the argument
     * @param {string} input
     * @returns {string}
     */
    intepret(src) {
        const SIGNS = {
            ".": 0.1,
            "_": 0.5,
            "-": 1,
            "=": 25
        };
        const INSTRUCT_REGEX = /^(.+?)\s+(.+)$/;
        const instructions = src.split("\n");
        
        const reservedVariables = {
            "in": this.#callInputWithClosure(),
            "nl": 10,
            "sp": 32,
        }
        const variables = {};
        let output = "";

        for (let instructionNum = 0; instructionNum < instructions.length; ++instructionNum) {
            const instruction = instructions[instructionNum].trim();
            const exec = INSTRUCT_REGEX.exec(instruction);

            if (!exec) continue;

            const [_, instructor, expression] = exec;

            // Start processing expression

            let signGroups = expression.split(" ");
            let signGroupValues = [];

            signGroupsLoop: for (let signGroupNum = 0; signGroupNum < signGroups.length; ++signGroupNum) {
                const signGroup = signGroups[signGroupNum];
                let signGroupValue = 0,
                    dupliStack = [];

                signGroupLoop: for (let signNum = 0; signNum < signGroup.length; ++signNum) {
                    let sign = signGroup[signNum];

                    switch (sign) {
                        case "{": {
                            let variableName = "",
                                variableChar = "";
    
                            while ((variableChar = signGroup[++signNum]) !== "}") {
                                if (signNum >= signGroup.length)
                                    break signGroupLoop;
    
                                variableName += variableChar;
                            }
    
                            addToTarget(variables[variableName]);
                            break;
                        }
                        case "[": {
                            let variableName = "",
                                variableChar = "";
                            
                            while ((variableChar = signGroup[++signNum]) !== "]") {
                                if (signNum >= signGroup.length)
                                    break signGroupLoop;
                                
                                variableName += variableChar;
                            }
    
                            const calledReservedVar = reservedVariables[variableName]
                            addToTarget((typeof calledReservedVar === "function" ? calledReservedVar() : calledReservedVar));

                            break;
                        }
                        case "(": {
                            dupliStack.push(0);
                            break;
                        }
                        case ")": {
                            if (dupliStack.length === 1)
                                signGroupValue *= dupliStack[0];
                            else
                                dupliStack[dupliStack.length - 2] *= dupliStack[dupliStack.length - 1];

                            dupliStack.pop();
                            break;
                        }
                        case "|":
                            signGroupValues.push(signGroupValue);
                            break signGroupsLoop;
                        default:
                            addToTarget(SIGNS[sign] || 0);
                            break;
                    }
                }

                signGroupValues.push(signGroupValue);

                function addToTarget(value) {
                    if (dupliStack.length === 0)
                        signGroupValue += value;
                    else
                        dupliStack[dupliStack.length - 1] += value;
                }
            }
            
            const lastResult = signGroupValues.reduce((signGroupValue1, signGroupValue2) => signGroupValue1 - signGroupValue2);

            // Check instructor what to do with the expression

            if (instructor === ">")
                output += String.fromCharCode(Math.trunc(lastResult));
            else if (instructor === ">>")
                output += lastResult.toString();
            else if (instructor.startsWith("#")) {
                const variableName = instructor.slice(1, instructor.length);
                variables[variableName] = lastResult;
            }
        }

        return output;
    }
}
const src = await Bun.file("./input.dsh").text();

const DashInstance = new Dash();

console.log(
    DashInstance
        .setInput("javascript")
        .intepret(src)
);