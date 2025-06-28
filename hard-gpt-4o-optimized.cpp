
#include <iostream>
#include <vector>
#include <limits>
#include <chrono>

// Linear Congruential Generator
class LCG {
public:
    using ull = unsigned long long;
    
    LCG(ull seed, ull a = 1664525, ull c = 1013904223, ull m = 1ULL << 32) 
        : seed(seed), a(a), c(c), m(m) {}

    ull next() {
        seed = (a * seed + c) % m;
        return seed;
    }
    
private:
    ull seed, a, c, m;
};

// Kadane's algorithm for maximum subarray sum
long long max_subarray_sum(int n, unsigned long long seed, int min_val, int max_val) {
    const int range = max_val - min_val + 1;
    LCG lcg(seed);
    std::vector<int> random_numbers(n);
    
    for (int i = 0; i < n; ++i) {
        random_numbers[i] = lcg.next() % range + min_val;
    }
    
    long long max_sum = std::numeric_limits<long long>::min(), current_sum = 0;
    for (int num : random_numbers) {
        current_sum = std::max(static_cast<long long>(num), current_sum + num);
        max_sum = std::max(max_sum, current_sum);
    }
    
    return max_sum;
}

// Calculate total max subarray sum over 20 runs
long long total_max_subarray_sum(int n, unsigned long long initial_seed, int min_val, int max_val) {
    long long total_sum = 0;
    LCG lcg(initial_seed);
    
    for (int i = 0; i < 20; ++i) {
        unsigned long long seed = lcg.next();
        total_sum += max_subarray_sum(n, seed, min_val, max_val);
    }
    return total_sum;
}

int main() {
    int n = 10000;
    unsigned long long initial_seed = 42;
    int min_val = -10;
    int max_val = 10;

    auto start = std::chrono::high_resolution_clock::now();
    long long result = total_max_subarray_sum(n, initial_seed, min_val, max_val);
    auto end = std::chrono::high_resolution_clock::now();

    std::chrono::duration<double> elapsed = end - start;

    std::cout << "Total Maximum Subarray Sum (20 runs): " << result << std::endl;
    std::cout << "Execution Time: " << elapsed.count() << " seconds" << std::endl;

    return 0;
}
