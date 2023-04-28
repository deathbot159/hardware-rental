import AccountService from "../Source/Versions/v1/Services/AccountService";

describe("AuthorizationService.Check(email, password)", () => {
    test('provided credentials should be in database', () => {
        return AccountService.CheckAccount("t.falana@qarbon.it", "c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec")
            .then(res => {
                expect(res.status).toBe(0)
            })
    }, 60000)
    test('provided credentials should be in cache', () => {
        return AccountService.CheckAccount("t.falana@qarbon.it", "c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec").then(res => {
            expect(res.fromCache).toBe(true)
        })
    }, 60000)
    test('provided credentials shouldn\'t be in database', () => {
        return AccountService.CheckAccount("Xd", "123").then(res => {
            expect(res.status).toBe(1)
        })
    })
})

describe("AuthorizationService.Get(email, password)", () => {
    test('data section should be not empty', () => {
        return AccountService.GetAccount("t.falana@qarbon.it", "c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec").then(res => {
            expect(res.data).not.toBe({})
        })
    })
})