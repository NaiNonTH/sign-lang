import { expect, test } from "bun:test"
import Dash from "..";

// Made to test the test file itself, lol

async function getResultFromSample(filename) {
    const src = await Bun.file(`./test/samples/${filename}.dsh`).text();
    const intepreter = new Dash();
    return intepreter.intepret(src);
}

test("Signs and Outputting", async () => {
    const result = await getResultFromSample("test1");

    expect(result).toBe("54e");
});

test("Sign Groups", async () => {
    const result = await getResultFromSample("test2");
    
    expect(result).toBe("arb");
});

test("Duplicators", async () => {
    const result = await getResultFromSample("test3");

    expect(result).toBe("a");
})

test("Barriers", async () => {
    const result = await getResultFromSample("test4");

    expect(result).toBe("69420");
})

test("Labels", async () => {
    const result = await getResultFromSample("test5");

    expect(result).toBe(":soo:");
})

test("Jumps", async () => {
    const result = await getResultFromSample("test6");

    expect(result).toBe("34");
})