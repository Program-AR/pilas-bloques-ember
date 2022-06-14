export const splitBy = (condition, elements) => {
    const matchers = []
    const nonMatchers = []

    elements.forEach(e => {
        if (condition(e)) matchers.push(e)
        else nonMatchers.push(e)
    })

    return [matchers, nonMatchers]
}