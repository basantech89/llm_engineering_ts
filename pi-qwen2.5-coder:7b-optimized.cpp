
#include <iostream>
#include <iomanip> // for std::fixed, std::setprecision
#include <chrono>

using namespace std;

double calculate(int64_t iterations, double param1, double param2) {
    long double result = 0.0;
    int64_t i = 1;
    while (i <= iterations) {
        double j = 1.0 * i * param1 - param2; // Avoid int overflow by using double
        result -= (1 / j);
        j = 1.0 * i * param1 + param2;
        result += (1 / j);
        i++;
    }
    return result * 4.0L; // Cast to long double for accurate result
}

int main() {
    auto start_time = chrono::high_resolution_clock::now();
    int64_t iterations = 100_000_000;
    double param1 = 4.0, param2 = 1.0;
    double result = calculate(iterations, param1, param2);
    auto end_time = chrono::high_resolution_clock::now();

    cout << fixed << setprecision(12) << "Result: " << result << endl;
    auto duration = chrono::duration_cast<chrono::microseconds>(end_time - start_time).count();
    cout << "Execution Time: " << duration / 1e6 << " milliseconds" << endl;

    return 0;
}
