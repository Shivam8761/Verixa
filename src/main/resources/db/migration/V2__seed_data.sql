-- V2__seed_data.sql: Initial Seed Data for Verixa (TCS Ninja & Core Topics)

-- 1. Seed TCS Company & Ninja Role
INSERT INTO companies (id, name, logo_url, description, active, created_at)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'TCS',
    'https://logo.clearbit.com/tcs.com',
    'Tata Consultancy Services is a global leader in IT services, consulting, and business solutions.',
    TRUE,
    CURRENT_TIMESTAMP
);

INSERT INTO job_roles (id, company_id, title, description, active, created_at)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Ninja',
    'TCS Ninja Cadre entry-level software developer profile for fresh graduates.',
    TRUE,
    CURRENT_TIMESTAMP
);

-- 2. Seed Rounds for TCS Ninja
INSERT INTO rounds (id, role_id, name, round_order) VALUES
('33333333-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Aptitude', 1),
('33333333-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Logical Reasoning', 2),
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Verbal', 3),
('33333333-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Coding', 4),
('33333333-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Technical', 5),
('33333333-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', 'HR', 6);

-- 3. Seed Core Topics
INSERT INTO topics (id, name, category) VALUES
('44444444-0001-0000-0000-000000000000', 'Arrays', 'DSA'),
('44444444-0002-0000-0000-000000000000', 'Strings', 'DSA'),
('44444444-0003-0000-0000-000000000000', 'Linked List', 'DSA'),
('44444444-0004-0000-0000-000000000000', 'Stack', 'DSA'),
('44444444-0005-0000-0000-000000000000', 'Queue', 'DSA'),
('44444444-0006-0000-0000-000000000000', 'Hashing', 'DSA'),
('44444444-0007-0000-0000-000000000000', 'Binary Search', 'DSA'),
('44444444-0008-0000-0000-000000000000', 'Trees', 'DSA'),
('44444444-0009-0000-0000-000000000000', 'Graphs', 'DSA'),
('44444444-0010-0000-0000-000000000000', 'Dynamic Programming', 'DSA'),
('44444444-0011-0000-0000-000000000000', 'Java', 'SUBJECT'),
('44444444-0012-0000-0000-000000000000', 'OOP', 'SUBJECT'),
('44444444-0013-0000-0000-000000000000', 'DBMS', 'SUBJECT'),
('44444444-0014-0000-0000-000000000000', 'SQL', 'SUBJECT'),
('44444444-0015-0000-0000-000000000000', 'Operating Systems', 'SUBJECT'),
('44444444-0016-0000-0000-000000000000', 'Computer Networks', 'SUBJECT'),
('44444444-0017-0000-0000-000000000000', 'Aptitude', 'QUANT'),
('44444444-0018-0000-0000-000000000000', 'Logical Reasoning', 'QUANT'),
('44444444-0019-0000-0000-000000000000', 'Verbal Ability', 'QUANT'),
('44444444-0020-0000-0000-000000000000', 'HR & Behavioral', 'HR');

-- 4. Seed Questions (Sample & PYQ-style)

-- Question 1: Aptitude MCQ (TCS Ninja Round 1)
INSERT INTO questions (id, title, description, question_type, category, difficulty, company_id, role_id, round_id, topic_id, question_year, explanation, active)
VALUES (
    '55555555-0001-0000-0000-000000000000',
    'Speed, Time and Distance - Train Crossing',
    'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
    'MCQ',
    'PYQ_STYLE',
    'EASY',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-1111-1111-1111-111111111111',
    '44444444-0017-0000-0000-000000000000',
    2023,
    'Speed of train = 240 / 24 = 10 m/s. Total distance to cross platform = 240 + 650 = 890 m. Time required = 890 / 10 = 89 seconds.',
    TRUE
);

INSERT INTO question_options (id, question_id, option_text, is_correct, explanation) VALUES
('66666666-0001-0001-0000-000000000000', '55555555-0001-0000-0000-000000000000', '65 seconds', FALSE, NULL),
('66666666-0001-0002-0000-000000000000', '55555555-0001-0000-0000-000000000000', '89 seconds', TRUE, 'Correct! Speed = 10 m/s, Total distance = 890 m.'),
('66666666-0001-0003-0000-000000000000', '55555555-0001-0000-0000-000000000000', '100 seconds', FALSE, NULL),
('66666666-0001-0004-0000-000000000000', '55555555-0001-0000-0000-000000000000', '120 seconds', FALSE, NULL);

-- Question 2: Technical Java MCQ
INSERT INTO questions (id, title, description, question_type, category, difficulty, company_id, role_id, round_id, topic_id, question_year, explanation, active)
VALUES (
    '55555555-0002-0000-0000-000000000000',
    'Java Memory Management - String Constant Pool',
    'Which memory area in Java stores String literals created without the "new" keyword?',
    'MCQ',
    'PRACTICE',
    'EASY',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-5555-5555-5555-555555555555',
    '44444444-0011-0000-0000-000000000000',
    2024,
    'String literals are stored in the String Constant Pool inside Java Heap Memory.',
    TRUE
);

INSERT INTO question_options (id, question_id, option_text, is_correct, explanation) VALUES
('66666666-0002-0001-0000-000000000000', '55555555-0002-0000-0000-000000000000', 'Java Stack', FALSE, NULL),
('66666666-0002-0002-0000-000000000000', '55555555-0002-0000-0000-000000000000', 'String Constant Pool (in Heap)', TRUE, 'Correct! String literals reside in SCP inside the Heap memory.'),
('66666666-0002-0003-0000-000000000000', '55555555-0002-0000-0000-000000000000', 'Method Area / PermGen', FALSE, NULL),
('66666666-0002-0004-0000-000000000000', '55555555-0002-0000-0000-000000000000', 'Native Stack', FALSE, NULL);

-- Question 3: Coding Problem (Arrays / DSA & TCS Coding Round)
INSERT INTO questions (id, title, description, question_type, category, difficulty, company_id, role_id, round_id, topic_id, starter_code, solution, constraints, input_format, output_format, explanation, active)
VALUES (
    '55555555-0003-0000-0000-000000000000',
    'Two Sum Problem',
    'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution.',
    'CODING',
    'PRACTICE',
    'EASY',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-4444-4444-4444-444444444444',
    '44444444-0001-0000-0000-000000000000',
    'import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }

    public static void main(String[] scannerInput) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        int target = sc.nextInt();
        int[] result = twoSum(nums, target);
        System.out.println(result[0] + " " + result[1]);
    }
}',
    'import java.util.HashMap;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{0, 0};
    }
}',
    '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9',
    'First line contains integer N (size of array). Second line contains N space-separated integers. Third line contains integer target.',
    'Print two space-separated indices.',
    'Use a HashMap to store values and their indices for O(N) time complexity.',
    TRUE
);

INSERT INTO coding_test_cases (id, question_id, input_data, expected_output, is_hidden) VALUES
('77777777-0001-0000-0000-000000000000', '55555555-0003-0000-0000-000000000000', '4\n2 7 11 15\n9', '0 1', FALSE),
('77777777-0002-0000-0000-000000000000', '55555555-0003-0000-0000-000000000000', '3\n3 2 4\n6', '1 2', FALSE),
('77777777-0003-0000-0000-000000000000', '55555555-0003-0000-0000-000000000000', '2\n3 3\n6', '0 1', TRUE);

-- Question 4: Generic DSA Coding Problem (Palindrome String)
INSERT INTO questions (id, title, description, question_type, category, difficulty, company_id, role_id, round_id, topic_id, starter_code, solution, constraints, input_format, output_format, explanation, active)
VALUES (
    '55555555-0004-0000-0000-000000000000',
    'Valid Palindrome',
    'Check whether a given string is a palindrome ignoring case and non-alphanumeric characters.',
    'CODING',
    'PRACTICE',
    'EASY',
    NULL,
    NULL,
    NULL,
    '44444444-0002-0000-0000-000000000000',
    'import java.util.*;

public class Solution {
    public static boolean isPalindrome(String s) {
        // Write your code here
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String str = sc.nextLine();
        System.out.println(isPalindrome(str) ? "true" : "false");
    }
}',
    'public class Solution {
    public static boolean isPalindrome(String s) {
        String cleaned = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        int left = 0, right = cleaned.length() - 1;
        while (left < right) {
            if (cleaned.charAt(left) != cleaned.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }
}',
    '1 <= s.length <= 2 * 10^5',
    'Single line containing a string.',
    'Print true or false.',
    'Clean non-alphanumeric characters and check using two-pointer approach.',
    TRUE
);

INSERT INTO coding_test_cases (id, question_id, input_data, expected_output, is_hidden) VALUES
('77777777-0004-0000-0000-000000000000', '55555555-0004-0000-0000-000000000000', 'A man, a plan, a canal: Panama', 'true', FALSE),
('77777777-0005-0000-0000-000000000000', '55555555-0004-0000-0000-000000000000', 'race a car', 'false', FALSE);

-- Question 5: Aptitude - Work and Time
INSERT INTO questions (id, title, description, question_type, category, difficulty, company_id, role_id, round_id, topic_id, question_year, explanation, active)
VALUES (
    '55555555-0005-0000-0000-000000000000',
    'Work and Time - Combined Efficiency',
    'A can complete a piece of work in 12 days and B can complete the same work in 18 days. If they work together, in how many days will they finish the work?',
    'MCQ',
    'PYQ_STYLE',
    'EASY',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-1111-1111-1111-111111111111',
    '44444444-0017-0000-0000-000000000000',
    2023,
    'A''s 1-day work = 1/12. B''s 1-day work = 1/18. Combined 1-day work = 1/12 + 1/18 = (3+2)/36 = 5/36. Total days = 36/5 = 7.2 days.',
    TRUE
);

INSERT INTO question_options (id, question_id, option_text, is_correct, explanation) VALUES
('66666666-0005-0001-0000-000000000000', '55555555-0005-0000-0000-000000000000', '6 days', FALSE, NULL),
('66666666-0005-0002-0000-000000000000', '55555555-0005-0000-0000-000000000000', '7.2 days', TRUE, 'Correct! Combined rate = 1/12 + 1/18 = 5/36, so days = 36/5 = 7.2.'),
('66666666-0005-0003-0000-000000000000', '55555555-0005-0000-0000-000000000000', '8.5 days', FALSE, NULL),
('66666666-0005-0004-0000-000000000000', '55555555-0005-0000-0000-000000000000', '9 days', FALSE, NULL);

-- Question 6: Logical Reasoning - Number Series
INSERT INTO questions (id, title, description, question_type, category, difficulty, company_id, role_id, round_id, topic_id, question_year, explanation, active)
VALUES (
    '55555555-0006-0000-0000-000000000000',
    'Number Series Completion',
    'Find the missing term in the sequence: 4, 9, 25, 49, 121, ?',
    'MCQ',
    'PYQ_STYLE',
    'MEDIUM',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-2222-2222-2222-222222222222',
    '44444444-0018-0000-0000-000000000000',
    2024,
    'The series consists of squares of prime numbers: 2^2, 3^2, 5^2, 7^2, 11^2. Next prime number is 13, 13^2 = 169.',
    TRUE
);

INSERT INTO question_options (id, question_id, option_text, is_correct, explanation) VALUES
('66666666-0006-0001-0000-000000000000', '55555555-0006-0000-0000-000000000000', '144', FALSE, NULL),
('66666666-0006-0002-0000-000000000000', '55555555-0006-0000-0000-000000000000', '169', TRUE, 'Correct! Squares of prime numbers (2, 3, 5, 7, 11, 13). 13^2 = 169.'),
('66666666-0006-0003-0000-000000000000', '55555555-0006-0000-0000-000000000000', '196', FALSE, NULL),
('66666666-0006-0004-0000-000000000000', '55555555-0006-0000-0000-000000000000', '225', FALSE, NULL);

-- Question 7: Verbal - Error Spotting
INSERT INTO questions (id, title, description, question_type, category, difficulty, company_id, role_id, round_id, topic_id, question_year, explanation, active)
VALUES (
    '55555555-0007-0000-0000-000000000000',
    'Subject-Verb Agreement Error',
    'Identify the part containing an error: "Neither of the two candidates (A) / have submitted (B) / their original documents (C) / before the deadline (D)."',
    'MCQ',
    'PYQ_STYLE',
    'EASY',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-0019-0000-0000-000000000000',
    2023,
    '"Neither of" is followed by a singular verb. Therefore, "have submitted" should be replaced with "has submitted".',
    TRUE
);

INSERT INTO question_options (id, question_id, option_text, is_correct, explanation) VALUES
('66666666-0007-0001-0000-000000000000', '55555555-0007-0000-0000-000000000000', 'Neither of the two candidates', FALSE, NULL),
('66666666-0007-0002-0000-000000000000', '55555555-0007-0000-0000-000000000000', 'have submitted', TRUE, 'Correct! "Neither" takes a singular verb "has submitted".'),
('66666666-0007-0003-0000-000000000000', '55555555-0007-0000-0000-000000000000', 'their original documents', FALSE, NULL),
('66666666-0007-0004-0000-000000000000', '55555555-0007-0000-0000-000000000000', 'before the deadline', FALSE, NULL);

-- Question 8: DBMS & SQL - Joins
INSERT INTO questions (id, title, description, question_type, category, difficulty, company_id, role_id, round_id, topic_id, question_year, explanation, active)
VALUES (
    '55555555-0008-0000-0000-000000000000',
    'SQL Join Types - Full Outer Join',
    'Which SQL JOIN returns all records when there is a match in either left or right table records?',
    'MCQ',
    'PRACTICE',
    'EASY',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-5555-5555-5555-555555555555',
    '44444444-0014-0000-0000-000000000000',
    2024,
    'FULL OUTER JOIN returns all matching and non-matching records from both left and right tables.',
    TRUE
);

INSERT INTO question_options (id, question_id, option_text, is_correct, explanation) VALUES
('66666666-0008-0001-0000-000000000000', '55555555-0008-0000-0000-000000000000', 'INNER JOIN', FALSE, NULL),
('66666666-0008-0002-0000-000000000000', '55555555-0008-0000-0000-000000000000', 'LEFT JOIN', FALSE, NULL),
('66666666-0008-0003-0000-000000000000', '55555555-0008-0000-0000-000000000000', 'FULL OUTER JOIN', TRUE, 'Correct! Full Outer Join combines results of both Left and Right joins.'),
('66666666-0008-0004-0000-000000000000', '55555555-0008-0000-0000-000000000000', 'CROSS JOIN', FALSE, NULL);

-- Question 9: Operating Systems - Deadlock
INSERT INTO questions (id, title, description, question_type, category, difficulty, company_id, role_id, round_id, topic_id, question_year, explanation, active)
VALUES (
    '55555555-0009-0000-0000-000000000000',
    'Deadlock Coffman Conditions',
    'Which of the following is NOT one of the four essential Coffman conditions required for a deadlock to occur?',
    'MCQ',
    'PRACTICE',
    'MEDIUM',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-5555-5555-5555-555555555555',
    '44444444-0015-0000-0000-000000000000',
    2024,
    'The 4 Coffman conditions are Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. Preemption is NOT a condition (No Preemption is).',
    TRUE
);

INSERT INTO question_options (id, question_id, option_text, is_correct, explanation) VALUES
('66666666-0009-0001-0000-000000000000', '55555555-0009-0000-0000-000000000000', 'Mutual Exclusion', FALSE, NULL),
('66666666-0009-0002-0000-000000000000', '55555555-0009-0000-0000-000000000000', 'Hold and Wait', FALSE, NULL),
('66666666-0009-0003-0000-000000000000', '55555555-0009-0000-0000-000000000000', 'Preemption allowed', TRUE, 'Correct! "No Preemption" is required for deadlock, not preemption.'),
('66666666-0009-0004-0000-000000000000', '55555555-0009-0000-0000-000000000000', 'Circular Wait', FALSE, NULL);

-- Question 10: DSA Coding - Maximum Subarray (Kadane's Algorithm)
INSERT INTO questions (id, title, description, question_type, category, difficulty, company_id, role_id, round_id, topic_id, starter_code, solution, constraints, input_format, output_format, explanation, active)
VALUES (
    '55555555-0010-0000-0000-000000000000',
    'Maximum Subarray Sum (Kadanes)',
    'Given an integer array `nums`, find the contiguous subarray with the largest sum and return its sum.',
    'CODING',
    'PRACTICE',
    'MEDIUM',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-4444-4444-4444-444444444444',
    '44444444-0001-0000-0000-000000000000',
    'import java.util.*;

public class Solution {
    public static int maxSubArray(int[] nums) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        System.out.println(maxSubArray(nums));
    }
}',
    'public class Solution {
    public static int maxSubArray(int[] nums) {
        int maxSoFar = nums[0];
        int currentMax = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currentMax = Math.max(nums[i], currentMax + nums[i]);
            maxSoFar = Math.max(maxSoFar, currentMax);
        }
        return maxSoFar;
    }
}',
    '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
    'First line integer N. Second line N space-separated integers.',
    'Print single integer maximum subarray sum.',
    'Use Kadane''s algorithm with O(N) time complexity and O(1) auxiliary space.',
    TRUE
);

INSERT INTO coding_test_cases (id, question_id, input_data, expected_output, is_hidden) VALUES
('77777777-0010-0001-0000-000000000000', '55555555-0010-0000-0000-000000000000', '9\n-2 1 -3 4 -1 2 1 -5 4', '6', FALSE),
('77777777-0010-0002-0000-000000000000', '55555555-0010-0000-0000-000000000000', '1\n1', '1', FALSE),
('77777777-0010-0003-0000-000000000000', '55555555-0010-0000-0000-000000000000', '5\n5 4 -1 7 8', '23', TRUE);

-- Question 11: DSA Coding - Valid Parentheses (Stack)
INSERT INTO questions (id, title, description, question_type, category, difficulty, company_id, role_id, round_id, topic_id, starter_code, solution, constraints, input_format, output_format, explanation, active)
VALUES (
    '55555555-0011-0000-0000-000000000000',
    'Valid Parentheses String',
    'Given a string `s` containing just characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.',
    'CODING',
    'PRACTICE',
    'EASY',
    NULL,
    NULL,
    NULL,
    '44444444-0004-0000-0000-000000000000',
    'import java.util.*;

public class Solution {
    public static boolean isValid(String s) {
        // Write your code here
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNext() ? sc.next() : "";
        System.out.println(isValid(s) ? "true" : "false");
    }
}',
    'import java.util.Stack;

public class Solution {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == ''('' || c == ''{'' || c == ''['') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == '')'' && top != ''('') return false;
                if (c == ''}'' && top != ''{'') return false;
                if (c == '']'' && top != ''['') return false;
            }
        }
        return stack.isEmpty();
    }
}',
    '1 <= s.length <= 10^4',
    'Single line containing brackets string.',
    'Print true or false.',
    'Use a Stack to match open and closing brackets in O(N) time.',
    TRUE
);

INSERT INTO coding_test_cases (id, question_id, input_data, expected_output, is_hidden) VALUES
('77777777-0011-0001-0000-000000000000', '55555555-0011-0000-0000-000000000000', '()[]{}', 'true', FALSE),
('77777777-0011-0002-0000-000000000000', '55555555-0011-0000-0000-000000000000', '(]', 'false', FALSE);

-- Question 12: DSA Coding - Binary Search
INSERT INTO questions (id, title, description, question_type, category, difficulty, company_id, role_id, round_id, topic_id, starter_code, solution, constraints, input_format, output_format, explanation, active)
VALUES (
    '55555555-0012-0000-0000-000000000000',
    'Binary Search in Sorted Array',
    'Given an array of integers `nums` sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index. Otherwise, return -1.',
    'CODING',
    'PRACTICE',
    'EASY',
    NULL,
    NULL,
    NULL,
    '44444444-0007-0000-0000-000000000000',
    'import java.util.*;

public class Solution {
    public static int search(int[] nums, int target) {
        // Write your code here
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();
        System.out.println(search(nums, target));
    }
}',
    'public class Solution {
    public static int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}',
    '1 <= nums.length <= 10^4',
    'First line N. Second line N space-separated sorted integers. Third line target integer.',
    'Print index of target or -1.',
    'Binary Search achieves O(log N) runtime complexity.',
    TRUE
);

INSERT INTO coding_test_cases (id, question_id, input_data, expected_output, is_hidden) VALUES
('77777777-0012-0001-0000-000000000000', '55555555-0012-0000-0000-000000000000', '6\n-1 0 3 5 9 12\n9', '4', FALSE),
('77777777-0012-0002-0000-000000000000', '55555555-0012-0000-0000-000000000000', '6\n-1 0 3 5 9 12\n2', '-1', FALSE);

-- Seed Sample Contest
INSERT INTO contests (id, title, description, start_time, end_time, duration_minutes, status)
VALUES (
    '88888888-0001-0000-0000-000000000000',
    'Verixa Weekly Placement Challenge #1',
    'Test your Aptitude, Technical DSA, and Coding speed for top product & IT companies.',
    '2026-01-01 00:00:00',
    '2030-01-01 00:00:00',
    60,
    'LIVE'
);

INSERT INTO contest_questions (id, contest_id, question_id, marks) VALUES
('99999999-0001-0000-0000-000000000000', '88888888-0001-0000-0000-000000000000', '55555555-0001-0000-0000-000000000000', 10),
('99999999-0002-0000-0000-000000000000', '88888888-0001-0000-0000-000000000000', '55555555-0002-0000-0000-000000000000', 10),
('99999999-0003-0000-0000-000000000000', '88888888-0001-0000-0000-000000000000', '55555555-0003-0000-0000-000000000000', 30),
('99999999-0004-0000-0000-000000000000', '88888888-0001-0000-0000-000000000000', '55555555-0005-0000-0000-000000000000', 10),
('99999999-0005-0000-0000-000000000000', '88888888-0001-0000-0000-000000000000', '55555555-0006-0000-0000-000000000000', 10),
('99999999-0006-0000-0000-000000000000', '88888888-0001-0000-0000-000000000000', '55555555-0010-0000-0000-000000000000', 30);

