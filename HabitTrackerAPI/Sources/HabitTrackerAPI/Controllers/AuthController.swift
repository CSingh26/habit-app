import Vapor

struct SignupRequest: Content {
    let name: String
    let username: String
    let email: String
    let password: String
}

struct AuthController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let auth = routes.grouped("auth")
        auth.post("signup", use: signup)
    }

    func signup(req: Request) throws -> User {
        let data = try req.content.decode(SignupRequest.self)

        let user = User(
            name: data.name,
            username: data.username,
            email: data.email,
            password: data.password
        )

        try user.save(on: req.db)
        return user
    }
}
