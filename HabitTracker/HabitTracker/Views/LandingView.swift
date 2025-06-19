import SwiftUI

struct LandingView: View {
    var body: some View {
        NavigationStack {
            VStack(spacing: 32) {
                Spacer()
                
                Text("Welcome to Habit Hero")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .multilineTextAlignment(.center)
                
                Text("Gamify your personal growth")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                
                Spacer()
                
                VStack(spacing: 16) {
                    NavigationLink(destination: LoginView()) {
                        Text("Login")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(Color.white)
                            .cornerRadius(12)
                    }
                    
                    NavigationLink(destination: SignupView()) {
                        Text("Signup")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.green)
                            .foregroundColor(Color.white)
                            .cornerRadius(12)
                    }
                }
                .padding(.horizontal)
                
                Spacer()
            }
            .padding()
        }
    }
}

#Preview {
    
}
