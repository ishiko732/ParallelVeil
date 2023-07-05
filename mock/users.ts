const data: number[] = []
for (let i = 0; i < 126; i++) {
    data.push(i)
}
const users = Array.from(data, (item) => ({
    id: item,
    age: Math.random() * 60,
    name: `luffy-${++item}`,
    email: `luffy-${item}@126.com`
}))

export default users;