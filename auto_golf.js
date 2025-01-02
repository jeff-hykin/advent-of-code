import { FileSystem, glob } from "https://deno.land/x/quickr@0.6.72/main/file_system.js"
import $ from "https://deno.land/x/dax@0.39.2/mod.ts"
const $$ = (...args)=>$(...args).noThrow()

/**
 * @example
 * ```js
 * let resultCode = await shorten({
 *     codePath: "./solutions/2024/deno/1.js",
 *     inputOutputStrings: [    
 *         ["l(1,1)", "1"],
 *         ["l(1,2)", "2"],
 *         ["l(1,3)", "6"],
 *         ["l(1,4)", "24"],
 *         ["l(1,5)", "120"],
 *         ["l(2,1)", "2"],
 *         ["l(2,2)", "4"],
 *         ["l(2,3)", "18"],
 *     ],
 *     transformations: [
 *         (code) => code.replace(/l\((\d+),(\d+)\)/g, (_, a, b) => a * b),
 *     ],
 * })
 * ```
 */
export async function shorten({ codePath, runCommandMaker=(path)=>[`deno`, "run", "-A", `${path}`], inputOutputStrings, transformations }) {
    let code = await FileSystem.read(codePath)
    const [ folders, fileName, extension ] = FileSystem.pathPieces(codePath)
    const tempPath = await Deno.makeTempFile({
        prefix: fileName,
        suffix: extension,
    })
    await FileSystem.addPermissions({ path: tempPath, permissions: { owner: { canExecute: true }, group: { canExecute: true }, others: { canExecute: true } } })
    const checkSolution = async (solution) => {
        await FileSystem.write({path: tempPath, data: solution})
        for (let [input,correctOutput] of inputOutputStrings) {
            const givenOutput = await $$`${runCommandMaker(tempPath)}`.stdinText(input).stderr("null").text()
            if (givenOutput != correctOutput) {
                return false
            }
        }
        return true
    }
    let aTransformationWasFound = true
    const originalCode = code
    while (aTransformationWasFound) {
        aTransformationWasFound = false
        for (const transform of transformations) {
            while (true) {
                let newCode = transform(code)
                if (newCode && (newCode.length < code.length)) {
                    if (await checkSolution(newCode)) {
                        code = newCode
                        aTransformationWasFound = true
                        // immediately re-apply working transformations
                        continue
                    }
                }
                break
            }
        }
    }
    if (code != originalCode) {
        console.log(`shorten saved ${originalCode.length-code.length} chars`)
    }
    return code
}