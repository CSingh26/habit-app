import SwiftUI
import GoogleSignIn
import GoogleSignInSwift

struct LoginView: View {
    @State private var username = ""
    @State private var password = ""
    @State private var errorMessage = ""
    @State private var successMessage = ""
    @State private var isPasswordVisible = false

    var body: some View {
        VStack(spacing: 24) {
            Text("Log In")
                .font(.title)
                .fontWeight(.semibold)

            TextField("Username", text: $username)
                .textInputAutocapitalization(.never)
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

            if !errorMessage.isEmpty {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .font(.caption)
            }
            
            if !successMessage.isEmpty {
                Text(successMessage)
                    .foregroundColor(.green)
                    .font(.caption)
            }

            Button(action: handleLogin) {
                Text("Log In")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(12)
            }
        }
        .padding()
    }

    func handleLogin() {
        guard !username.isEmpty, !password.isEmpty else {
            errorMessage = "Please enter username and password."
            return
        }

        errorMessage = ""
        successMessage = ""

        guard let url = URL(string: "http://localhost:5489/api/auth/login") else {
            errorMessage = "Invalid URL"
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: String] = [
            "username": username,
            "password": password
        ]

        guard let httpBody = try? JSONSerialization.data(withJSONObject: body, options: []) else {
            errorMessage = "Failed to encode request"
            return
        }
        
        request.httpBody = httpBody

        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    errorMessage = "Error: \(error.localizedDescription)"
                    return
                }

                guard let httpResponse = response as? HTTPURLResponse else {
                    errorMessage = "Invalid response"
                    return
                }

                guard (200...299).contains(httpResponse.statusCode),
                      let data = data else {
                    errorMessage = "Login failed"
                    return
                }

                if let decoded = try? JSONDecoder().decode(LoginResponse.self, from: data) {
                    successMessage = decoded.message
                } else {
                    errorMessage = "Invalid credentials"
                }
            }
        }.resume()
    }

    struct LoginResponse: Codable {
        let message: String
    }
}

#Preview {
    LoginView()
}
