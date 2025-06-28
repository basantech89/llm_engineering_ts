
#include <iostream>
#include <vector>
#include <cstdint>
#include <chrono>
#include <limits>

uint32_t lcg(uint32_t seed, uint32_t a=1664525, uint32_t c=1013904223, uint32_t m=0x100000000ULL) {
    return (a * seed + c);
}

uint64_t max_subarray_sum(int n, uint32_t seed, int min_val, int max_val) {
    std::vector<int64_t> random_numbers;
    random_numbers.reserve(n);
    uint32_t s = seed;
    uint32_t range = static_cast<uint32_t>(max_val - min_val + 1);
    for (int i = 0; i < n; ++i) {
        s = lcg(s);
        random_numbers.push_back(static_cast<int64_t>(s % range) + min_val);
    }

    int64_t max_sum = std::numeric_limits<int64_t>::min();

    for (int i = 0; i < n; ++i) {
        int64_t current_sum = 0;
        for (int j = i; j < n; ++j) {
            current_sum += random_numbers[j];
            if (current_sum > max_sum) {
                max_sum = current_sum;
            }
        }
    }
    return max_sum;
}

uint64_t total_max_subarray_sum(int n, uint32_t initial_seed, int min_val, int max_val) {
    uint64_t total_sum = 0;
    uint32_t seed = initial_seed;
    for (int i = 0; i < 20; ++i) {
        seed = lcg(seed);
        total_sum += max_subarray_sum(n, seed, min_val, max_val);
    }
    return total_sum;
}

int main() {
    int n = 10000;
    uint32_t initial_seed = 42;
    int min_val = -10;
    int max_val = 10;

    auto start_time = std::chrono::high_resolution_clock::now();
    uint64_t result = total_max_subarray_sum(n, initial_seed, min_val, max_val);
    auto end_time = std::chrono::high_resolution_clock::now();

    std::chrono::duration<double> elapsed = end_time - start_time;
    std::cout << "Total Maximum Subarray Sum (20 runs): " << result << std::endl;
    std::cout << "Execution Time: " << elapsed.count() << " seconds" << std::endl;
    return 0;
}
