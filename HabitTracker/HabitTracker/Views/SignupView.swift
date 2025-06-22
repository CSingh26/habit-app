import SwiftUI

struct SignupView: View {
    @State private var name = ""
    @State private var email = ""
    @State private var username = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var errorMessage = ""
    @State private var isPasswordVisible = false
    @State private var isConfirmPasswordVisible = false

    var body: some View {
        VStack(spacing: 24) {
            Text("Create Account")
                .font(.title)
                .fontWeight(.semibold)

            TextField("Name", text: $name)
                .textInputAutocapitalization(.never)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(10)

            TextField("Username", text: $username)
                .textInputAutocapitalization(.never)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(10)

            TextField("Email", text: $email)
                .textInputAutocapitalization(.never)
                .keyboardType(.emailAddress)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(10)

            ZStack(alignment: .trailing) {
                Group {
                    if isPasswordVisible {
                        TextField("Password", text: $password)
                    } else {
                        SecureField("Password", text: $password)
                    }
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(10)

                Button(action: {
                    isPasswordVisible.toggle()
                }) {
                    Image(systemName: isPasswordVisible ? "eye.slash" : "eye")
                        .foregroundColor(.gray)
                        .padding()
                }
            }

            ZStack(alignment: .trailing) {
                Group {
                    if isConfirmPasswordVisible {
                        TextField("Confirm Password", text: $confirmPassword)
                    } else {
                        SecureField("Confirm Password", text: $confirmPassword)
                    }
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(10)

                Button(action: {
                    isConfirmPasswordVisible.toggle()
                }) {
                    Image(systemName: isConfirmPasswordVisible ? "eye.slash" : "eye")
                        .foregroundColor(.gray)
                        .padding()
                }
            }

            if !errorMessage.isEmpty {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .font(.caption)
            }

            Button(action: handleSignup) {
                Text("Sign Up")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.green)
                    .foregroundColor(.white)
                    .cornerRadius(12)
            }
        }
        .padding()
    } 

    func handleSignup() {
        guard !email.isEmpty, !name.isEmpty, !password.isEmpty, !confirmPassword.isEmpty, !username.isEmpty else {
            errorMessage = "All fields are not filled out. Please fill out all the fields."
            return
        }

        guard password == confirmPassword else {
            errorMessage = "Passwords do not match."
            return
        }

        let user = UserSignup(
            name: name,
            username: username,
            email: email,
            password: password
        )
        
        NetworkManager.shared.signup(user: user) {result in
            DispatchQueue.main.async {
                switch result {
                case .success(let message):
                    errorMessage = ""
                    print(message)
                case .failure(let error):
                    errorMessage = error.localizedDescription
                
                }
            }
        }
    }
}

#Preview {
    SignupView()
}
