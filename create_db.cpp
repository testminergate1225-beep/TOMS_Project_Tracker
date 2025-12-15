// Simple user database utility for the Project Developments dashboard.
// Stores users in a lightweight CSV file and exposes a console menu
// for CRUD-style management without external dependencies.

#include <algorithm>
#include <filesystem>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <random>
#include <sstream>
#include <string>
#include <vector>

namespace fs = std::filesystem;

struct User {
	std::string id;
	std::string username;
	std::string role;
	std::string email;
};

class UserDatabase {
public:
	explicit UserDatabase(std::string storagePath)
		: storagePath_(std::move(storagePath)) {
		load();
	}

	void listUsers() const {
		if (users_.empty()) {
			std::cout << "\nNo users found.\n";
			return;
		}
		std::cout << "\nRegistered Users" << '\n'
				  << std::left << std::setw(16) << "ID"
				  << std::setw(20) << "Username"
				  << std::setw(20) << "Role"
				  << "Email" << '\n';
		std::cout << std::string(72, '-') << '\n';
		for (const auto &user : users_) {
			std::cout << std::left << std::setw(16) << user.id
					  << std::setw(20) << user.username
					  << std::setw(20) << user.role
					  << user.email << '\n';
		}
	}

	void addUser(const std::string &username, const std::string &role, const std::string &email) {
		User user{generateId(), username, role, email};
		users_.push_back(std::move(user));
		save();
		std::cout << "User added successfully.\n";
	}

	void deleteUser(const std::string &id) {
		const auto originalSize = users_.size();
		users_.erase(std::remove_if(users_.begin(), users_.end(), [&](const User &user) {
			return user.id == id;
		}), users_.end());
		if (users_.size() == originalSize) {
			std::cout << "User not found.\n";
			return;
		}
		save();
		std::cout << "User removed.\n";
	}

	void updateRole(const std::string &id, const std::string &newRole) {
		for (auto &user : users_) {
			if (user.id == id) {
				user.role = newRole;
				save();
				std::cout << "Role updated.\n";
				return;
			}
		}
		std::cout << "User not found.\n";
	}

	void search(const std::string &needle) const {
		std::vector<User> matches;
		for (const auto &user : users_) {
			if (contains(user.id, needle) || contains(user.username, needle) || contains(user.email, needle)) {
				matches.push_back(user);
			}
		}
		if (matches.empty()) {
			std::cout << "No matches.\n";
			return;
		}
		std::cout << matches.size() << " match(es):\n";
		for (const auto &user : matches) {
			std::cout << "- " << user.id << " :: " << user.username << " :: "
					  << user.role << " :: " << user.email << '\n';
		}
	}

private:
	static bool contains(const std::string &haystack, const std::string &needle) {
		if (needle.empty()) { return true; }
		auto it = std::search(
			haystack.begin(), haystack.end(),
			needle.begin(), needle.end(),
			[](char lhs, char rhs) { return std::tolower(lhs) == std::tolower(rhs); });
		return it != haystack.end();
	}

	void load() {
		users_.clear();
		std::ifstream input(storagePath_);
		if (!input.is_open()) { return; }

		std::string line;
		while (std::getline(input, line)) {
			if (line.empty()) { continue; }
			std::stringstream ss(line);
			User user;
			std::getline(ss, user.id, ',');
			std::getline(ss, user.username, ',');
			std::getline(ss, user.role, ',');
			std::getline(ss, user.email, ',');
			if (!user.id.empty()) {
				users_.push_back(std::move(user));
			}
		}
	}

	void save() const {
		fs::create_directories(fs::path(storagePath_).parent_path());
		std::ofstream output(storagePath_, std::ios::trunc);
		for (const auto &user : users_) {
			output << user.id << ','
				   << user.username << ','
				   << user.role << ','
				   << user.email << '\n';
		}
	}

	static std::string generateId() {
		static std::mt19937_64 rng{std::random_device{}()};
		static const char alphabet[] = "0123456789abcdef";
		std::uniform_int_distribution<> dist(0, 15);
		std::string id = "usr-";
		for (int i = 0; i < 12; ++i) {
			id.push_back(alphabet[dist(rng)]);
		}
		return id;
	}

	std::vector<User> users_;
	std::string storagePath_;
};

void printMenu() {
	std::cout << "\nUser Database Menu" << '\n'
			  << "1. List users" << '\n'
			  << "2. Add user" << '\n'
			  << "3. Delete user" << '\n'
			  << "4. Update role" << '\n'
			  << "5. Search" << '\n'
			  << "6. Exit" << '\n'
			  << "Select an option: ";
}

int main() {
	UserDatabase db{"data/users.db"};
	while (true) {
		printMenu();
		int choice = 0;
		if (!(std::cin >> choice)) {
			std::cerr << "Input error. Exiting." << std::endl;
			break;
		}
		std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

		if (choice == 1) {
			db.listUsers();
		} else if (choice == 2) {
			std::string username, role, email;
			std::cout << "Username: ";
			std::getline(std::cin, username);
			std::cout << "Role: ";
			std::getline(std::cin, role);
			std::cout << "Email: ";
			std::getline(std::cin, email);
			if (username.empty() || email.empty()) {
				std::cout << "Username and email are required.\n";
			} else {
				db.addUser(username, role.empty() ? "viewer" : role, email);
			}
		} else if (choice == 3) {
			std::string id;
			std::cout << "User ID to remove: ";
			std::getline(std::cin, id);
			db.deleteUser(id);
		} else if (choice == 4) {
			std::string id, role;
			std::cout << "User ID to update: ";
			std::getline(std::cin, id);
			std::cout << "New role: ";
			std::getline(std::cin, role);
			db.updateRole(id, role);
		} else if (choice == 5) {
			std::string term;
			std::cout << "Search term: ";
			std::getline(std::cin, term);
			db.search(term);
		} else if (choice == 6) {
			std::cout << "Goodbye!" << std::endl;
			break;
		} else {
			std::cout << "Invalid option.\n";
		}
	}
	return 0;
}
