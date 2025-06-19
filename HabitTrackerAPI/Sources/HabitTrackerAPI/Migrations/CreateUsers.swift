import Fluent

struct CreateUser: Migration {
    func prepare(on database: any Database) -> EventLoopFuture<Void> {
        database.schema("users")
            .id()
            .field("name", .string, .required)
            .field("username", .string, .required)
            .field("email", .string, .required)
            .field("password", .string, .required)
            .unique(on: "email")
            .unique(on: "username")
            .create()
    }

    func revert(on database: any Database) -> EventLoopFuture<Void> {
        database.schema("users").delete()
    }
}
