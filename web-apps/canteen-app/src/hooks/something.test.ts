import { renderHook } from "@testing-library/react"
import { useSomething } from "./something"

test("abc", () => {
    try {
        renderHook(() => useSomething());
    } catch (error) {
        // expect(error.message).toBe("failed")
    }
})