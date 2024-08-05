"use server";

import axios from "axios";

const TEST = `
import unittest

longestRepeatingSubstring = Solution.longestRepeatingSubstring

class SilentTestResult(unittest.TextTestResult):
    def addError(self, test, err):
        pass

    def addFailure(self, test, err):
        pass

class TestRun(unittest.TestCase):

    def run_test(self, input_values, expected_value):
        solution = Solution()

        try:
            print("Input:", *input_values)
            with self.subTest():
                output = longestRepeatingSubstring(solution, *input_values)
                print("Output:", output)
                print("Expected value:", expected_value)
                self.assertEqual(output, expected_value)
        except:
            self.fail()

    def test_case_1(self):
        print("-----------------------------")
        print("Test Case 1:")
        self.run_test(["abcd"], 0)

    def test_case_2(self):
        print("-----------------------------")
        print("Test Case 2:")
        self.run_test(["abbaba"], 2)

    def test_case_3(self):
        print("-----------------------------")   
        print("Test Case 3:")
        self.run_test(["aabcaabdaab"], 3)

    def test_case_4(self):
        print("-----------------------------")
        print("Test Case 4:")
        self.run_test(["aaaaa"], 4)

    def tearDown(self):
        result = self.defaultTestResult()
        self._feedErrorsToResult(result, self._outcome.errors)
        if not result.wasSuccessful():
            print(f"{self._testMethodName} FAILED")
        else:
            print(f"{self._testMethodName} PASSED")

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(TestRun)
    runner = unittest.TextTestRunner(resultclass=SilentTestResult)
    runner.run(suite)
`;

export async function compileCode(requestData: any) {
  const endpoint = "https://emkc.org/api/v2/piston/execute";
  requestData.files[0].content = requestData.files[0].content + TEST
  console.log('rqdata:', requestData.files[0].content)
  try {
    const response = await axios.post(endpoint, requestData);
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
}
