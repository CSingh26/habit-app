import Foundation

struct UserSignup: Codable {
    let name: String
    let username: String
    let email: String
    let password: String
}

struct UserLogin: Codable {
    let username: String
    let password: String
}

class NetworkManager {
    static let shared = NetworkManager()
    let baseURL = "http://localhost:5489/api/auth"
    
    func signup(user: UserSignup, completion: @escaping (Result<String, Error>) -> Void) {
        guard let url = URL(string: "\(baseURL)/signup") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let jsonData = try JSONEncoder().encode(user)
            request.httpBody = jsonData
        } catch {
            completion(.failure(error))
            return
        }
        
        URLSession.shared.dataTask(with: request) { data, _, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            if let data = data,
               let responseJSON = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               let message = responseJSON["message"] as? String {
                completion(.success(message))
            } else {
                let err = NSError(domain: "", code: 400, userInfo: [NSLocalizedDescriptionKey: "Invalid server response"])
                completion(.failure(err))
            }
        }.resume()
    }
    
    func login(user: UserLogin, completion: @escaping (Result<String, Error>) -> Void) {
        guard let url = URL(string: "\(baseURL)/login") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        do {
            request.httpBody = try JSONEncoder().encode(user)
        } catch {
            completion(.failure(error))
            return
        }

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            if let data = data,
               let responseJSON = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               let message = responseJSON["message"] as? String {
                completion(.success(message))
            } else {
                let err = NSError(domain: "", code: 400, userInfo: [NSLocalizedDescriptionKey: "Invalid server response"])
                completion(.failure(err))
            }
        }.resume()
    }
}
