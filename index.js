/**
 * @class
 * @classdesc Declare a new Dash Intepreter instance
 */
export default class Dash {
    /**
     * @param {Object} config
     * @param {Function} config.onexecute
     */
    constructor(config) {
        this.input = "";
        this.userConfig = config;
        this.config = {
            onexecute: () => {}
        };
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
        Object.assign(this.config, this.userConfig);

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

            if (!exec || instruction.startsWith("|")) continue;

            const [_, instructor, expression] = exec;

            // Start processing expression

            let expressionValue = 0,
                dupliStack = [],
                addOrSubtract = 1;

            expressionLoop: for (let signNum = 0; signNum < expression.length; ++signNum) {
                let sign = expression[signNum];

                switch (sign) {
                    case "{": {
                        let variableName = "",
                            variableChar = "";
    
                        while ((variableChar = expression[++signNum]) !== "}") {
                            if (variableChar === " ")
                                break expressionLoop;
    
                            variableName += variableChar;
                        }
    
                        addToTarget(variables[variableName]);
                        break;
                    }
                    case "[": {
                        let variableName = "",
                            variableChar = "";
                        
                        while ((variableChar = expression[++signNum]) !== "]") {
                            if (variableChar === " ")
                                break expressionLoop;
                            
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
                            expressionValue *= dupliStack[0];
                        else
                            dupliStack[dupliStack.length - 2] *= dupliStack[dupliStack.length - 1];

                        dupliStack.pop();
                        break;
                    }
                    case " ": // end of sign group
                        addOrSubtract = -1;
                        break;
                    case "|":
                        break expressionLoop;
                    default:
                        addToTarget(SIGNS[sign]);
                        break;
                }
            }

            function addToTarget(value) {
                const valueToAdd = (value || 0) * addOrSubtract;

                if (dupliStack.length === 0)
                    expressionValue += valueToAdd;
                else
                    dupliStack[dupliStack.length - 1] += valueToAdd;
            }

            // Check instructor what to do with the expression

            if (instructor === ">") {
                const toOutput = String.fromCharCode(Math.trunc(expressionValue));
                output += toOutput;
                this.config.onexecute(toOutput);
            }
            else if (instructor === ">>") {
                const toOutput = expressionValue.toString();
                output += toOutput;
                this.config.onexecute(toOutput);
            }
            else if (instructor === "^") {
                instructionNum -= expressionValue - 1;
            }
            else if (instructor === "v") {
                instructionNum += expressionValue - 1;
            }
            else if (instructor.startsWith("#")) {
                const variableName = instructor.slice(1, instructor.length);
                variables[variableName] = expressionValue;
            }
        }

        return output;
    }
}