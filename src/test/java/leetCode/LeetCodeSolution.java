package leetCode;

import org.junit.Test;

import java.util.*;

public class LeetCodeSolution {

    /******************************************************************************************************
     * 动态规划 开始
     *****************************************************************************************************/
    /**
     * 45. 跳跃游戏 II
     */
    public int jump(int[] nums) {
        if (nums.length <= 1) {
            return 0;
        }

        int ret = 1;
        int to = nums[0], max = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (i > to) {
                to = max;
                ret++;
            }

            max = Math.max(max, i + nums[i]);
        }

        return ret;
    }

    @Test
    public void jumpTest() {
        System.out.println(jump(new int[]{2, 3, 1, 1, 4}) == 2);
        System.out.println(jump(new int[]{2, 1, 1, 1, 1, 1, 1, 1, 4}) == 7);
        System.out.println(jump(new int[]{2, 3, 0, 1, 4}) == 2);
        System.out.println(jump(new int[]{1, 2}) == 1);
    }

    /******************************************************************************************************
     * 动态规划 结束
     *****************************************************************************************************/

    /******************************************************************************************************
     * 贪心 开始
     *****************************************************************************************************/
    /** 不会
     *
     */
    public int[] maxNumber(int[] nums1, int[] nums2, int k) {
        return new int[0];
    }

    @Test
    public void maxNumberTest() {
        System.out.println(maxNumber(
                new int[]{3, 4, 6, 5},
                new int[]{9, 1, 2, 5, 8, 3},
                5) ==
                new int[]{9, 8, 6, 5, 3});
        System.out.println(maxNumber(
                new int[]{6, 7},
                new int[]{6, 0, 4},
                5) ==
                new int[]{6, 7, 6, 0, 4});
        System.out.println(maxNumber(
                new int[]{3, 9},
                new int[]{8, 9},
                3) ==
                new int[]{9, 8, 9});
    }

    /**
     * 122. 买卖股票的最佳时机 II
     */
    public int maxProfit(int[] prices) {
        if (prices.length <= 1) {
            return 0;
        }

        int res = 0;
        for (int i = 1; i < prices.length; i++) {
            res += prices[i] > prices[i - 1] ? prices[i] - prices[i - 1] : 0;
        }

        return res;
    }

    @Test
    public void maxProfitTest() {
        System.out.println(maxProfit(new int[]{7, 1, 5, 3, 6, 4}) == 7);
        System.out.println(maxProfit(new int[]{1, 2, 3, 4, 5}) == 4);
        System.out.println(maxProfit(new int[]{7, 6, 4, 3, 1}) == 0);
    }

    /**
     * 44. 通配符匹配
     * 动态规划实现
     */
    public boolean isMatch(String s, String p) {
        int m = s.length();
        int n = p.length();
        boolean[][] f = new boolean[m + 1][n + 1];

        f[0][0] = true;
        for (int i = 1; i <= n; i++) {
            f[0][i] = f[0][i - 1] && p.charAt(i - 1) == '*';
        }

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s.charAt(i - 1) == p.charAt(j - 1) || p.charAt(j - 1) == '?') {
                    f[i][j] = f[i - 1][j - 1];
                }

                if ('*' == p.charAt(j - 1)) {
                    f[i][j] = f[i - 1][j] || f[i][j - 1];
                }
            }
        }

        return f[m][n];
    }

    @Test
    public void testIsMatch() {
        System.out.println(isMatch("aa", "a") == false ? "ok" : "wrong");
        System.out.println(isMatch("aa", "*") == true ? "ok" : "wrong");
        System.out.println(isMatch("cb", "?a") == false ? "ok" : "wrong");
        System.out.println(isMatch("adceb", "*a*b") == true ? "ok" : "wrong");
        System.out.println(isMatch("acdcb", "a*c?b") == false ? "ok" : "wrong");

    }

    /**
     * 55. 跳跃游戏
     */

    public boolean canJump(int[] nums) {
        if (nums.length <= 1) {
            return true;
        }

        int maxValue = nums[0];
        for (int i = 0; i < nums.length && i <= maxValue; i++) {
            if (maxValue < nums[i] + i) {
                maxValue = nums[i] + i;
            }

            if (maxValue >= nums.length - 1) {
                return true;
            }
        }

        return false;
    }

    @Test
    public void testCanJump() {
        System.out.println(canJump(new int[]{2, 3, 1, 1, 4}) == true ? "ok" : "wrong");
        System.out.println(canJump(new int[]{3, 2, 1, 0, 4}) == false ? "ok" : "wrong");
        System.out.println(canJump(new int[]{1, 1, 1, 0}) == true ? "ok" : "wrong");

    }

    /******************************************************************************************************
     * 贪心 结束
     *****************************************************************************************************/
    /**
     * 26. 删除排序数组中的重复项
     */
    public int removeDuplicates(int[] nums) {
        if (nums.length <= 0) {
            return 0;
        }

        int ret = 1;
        for (int i = 0; i < nums.length - 1; i++) {
            if (nums[i] != nums[i + 1]) {
                nums[ret++] = nums[i];
            }
        }
        return ret;
    }

    /**
     * 25. K 个一组翻转链表
     */
    public ListNode reverseKGroup(ListNode head, int k) {
        if (null == head) {
            return head;
        }

        ListNode first = head;
        int len = 0;
        while (null != first) {
            len++;
            first = first.next;
        }

        int times = len / k;
        first = head;
        ListNode last = null, preLast = null, lastPre = first;
        for (int i = 0; i < times; i++) {
            // in k neighbor node
            for (int j = 0; j < k - 1; j++) {
                last = lastPre.next;
                // swap
                lastPre.next = last.next;
                last.next = first;
                // update
                first = last;
            }
            // between every k node fields
            if (null == preLast) {
                head = first;
            } else {
                preLast.next = first;
            }
            // update
            preLast = lastPre;
            lastPre = lastPre.next;
            first = lastPre;
        }

        return head;
    }

    @Test
    public void reverseKGroupTest() {
        System.out.println(reverseKGroup(createListNode(new int[]{1, 2, 3, 4}), 3));
        System.out.println(reverseKGroup(createListNode(new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}), 4));
        System.out.println(reverseKGroup(createListNode(new int[]{1, 2, 3, 4, 5}), 2));
    }

    /**
     * 24. 两两交换链表中的节点
     */

    public ListNode swapPairs(ListNode head) {
        if (null == head || null == head.next) {
            return head;
        }

        ListNode neighbor = head.next, me = head;
        head = head.next;
        while (true) {
            me.next = neighbor.next;
            neighbor.next = me;

            neighbor = me.next;
            if (null == neighbor || null == neighbor.next) {
                break;
            }

            me.next = neighbor.next;
            me = neighbor;
            neighbor = me.next;
        }

        return head;
    }

    @Test
    public void swapPairsTest() {
        System.out.println(swapPairs(createListNode(new int[]{1, 2, 3, 4})));
        System.out.println(swapPairs(createListNode(new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10})));
        System.out.println(swapPairs(createListNode(new int[]{1, 2, 3, 4, 5})));
    }

    /**
     * 23. 合并K个排序链表
     */
    public ListNode mergeKLists(ListNode[] lists) {
        ListNode retNode = null, tmpNode = null;
        while (validLists(lists)) {
            int minVal = getAndRemoveMinVal(lists);
            if (null == retNode) {
                tmpNode = retNode = new ListNode(minVal);
            } else {
                tmpNode.next = new ListNode(minVal);
                tmpNode = tmpNode.next;
            }
        }

        return retNode;
    }

    private boolean validLists(ListNode[] lists) {
        for (int i = 0; i < lists.length; i++) {
            if (null != lists[i]) {
                return true;
            }
        }

        return false;
    }

    private int getAndRemoveMinVal(ListNode[] lists) {
        int min = -1;
        boolean mark = true;
        for (int i = 0; i < lists.length; i++) {
            if (null == lists[i]) {
                continue;
            }

            if (mark) {
                min = i;
                mark = false;
            } else {
                min = lists[min].val < lists[i].val ? min : i;
            }
        }

        int minVal = lists[min].val;
        lists[min] = lists[min].next;
        return minVal;
    }


    @Test
    public void mergeKListsTest() {
        ListNode[] list = {
                createListNode(new int[]{1, 4, 5}),
                createListNode(new int[]{1, 3, 4}),
                createListNode(new int[]{2, 6})};
        System.out.println(mergeKLists(list));

    }


    /**
     * 22. 括号生成
     */
    public List<String> generateParenthesis(int n) {
        ArrayList<String> list = new ArrayList<>();
        if (n > 0) {
            dfs("(", n, 1, 1, list);
        }
        return list;
    }

    private void dfs(String s, final int n, int cost, int sum, List<String> list) {
        if (s.length() == n << 1) {
            list.add(s);
            return;
        }

        if (sum < n) {
            dfs(s + "(", n, cost + 1, sum + 1, list);
        }

        if (cost > 0) {
            dfs(s + ")", n, cost - 1, sum, list);
        }

    }

    @Test
    public void generateParenthesisTest() {
        System.out.println(generateParenthesis(4));
    }

    /**
     * 21. 合并两个有序链表
     */
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode retList;
        if (null == l1 && null == l2) {
            return null;
        }

        if (null == l1) {
            return l2;
        }

        if (null == l2) {
            return l1;
        }

        if (l1.val < l2.val) {
            retList = new ListNode(l1.val);
            l1 = l1.next;
        } else {
            retList = new ListNode(l2.val);
            l2 = l2.next;
        }

        ListNode temp = retList;
        while (l1 != null && l2 != null) {
            if (l1.val < l2.val) {
                temp.next = new ListNode(l1.val);
                l1 = l1.next;
            } else {
                temp.next = new ListNode(l2.val);
                l2 = l2.next;
            }

            temp = temp.next;
        }

        temp.next = null == l1 ? l2 : l1;
        return retList;
    }

    @Test
    public void mergeTwoListsTest() {
        ListNode node1 = new ListNode(1);
        ListNode temp = node1;
        for (Integer item : Arrays.asList(2, 4)) {
            temp.next = new ListNode(item);
            temp = temp.next;
        }

        ListNode node2 = new ListNode(1);
        temp = node2;
        for (Integer item : Arrays.asList(2, 3)) {
            temp.next = new ListNode(item);
            temp = temp.next;
        }
        System.out.println("node1 = " + node1);
        System.out.println("node2 = " + node2);

        System.out.println(mergeTwoLists(node1, node2));
    }

    /**
     * 20. 有效的括号
     */

    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (int i = 0; i < s.length(); i++) {
            char cl = s.charAt(i);
            if ("([{".indexOf(cl) != -1) {
                stack.push(cl);
            } else {
                if (stack.empty()) {
                    return false;
                }

                char top = stack.pop();
                if (cl == ')' && top == '(' || cl == ']' && top == '[' || cl == '}' && top == '{') {
                } else {
                    return false;
                }
            }
        }

        return stack.empty();
    }

    @Test
    public void isValidTest() {
        Arrays.asList("()", "()[]{}", "(]", "([)]", "{[]}").forEach(item -> {
            System.out.println(item + " " + isValid(item));
        });
    }

    /**
     * 19 Remove Nth Node From End of List
     * Definition for singly-linked list.
     * public class ListNode {
     * int val;
     * ListNode next;
     * ListNode(int x) { val = x; }
     * }
     */
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode node = head;
        int len = 0;
        for (; null != node; node = node.next, len++) ;
        len -= n;

        if (len == 0) {
            head = head.next;
        } else {
            node = head;
            for (int i = 0; null != node.next; node = node.next, i++)
                if (i == len - 1) {
                    node.next = node.next.next;
                    break;
                }

        }

        return head;
    }

    public class ListNode {
        int val;
        ListNode next;

        ListNode(int x) {
            val = x;
        }

        @Override
        public String toString() {
            StringBuffer sb = new StringBuffer("" + val);
            ListNode temp = next;
            while (null != temp) {
                sb.append("=>" + temp.val);
                temp = temp.next;
            }
            return sb.toString();
        }
    }

    private ListNode createListNode(int[] arr) {
        ListNode node1 = new ListNode(arr[0]);
        ListNode temp = node1;
        for (Integer i = 1; i < arr.length; i++) {
            temp.next = new ListNode(arr[i]);
            temp = temp.next;
        }
        return node1;
    }

    @Test
    public void removeNthFromEndTest() {
        ListNode listNode = new ListNode(1);
        ListNode temp = listNode;
        for (int i = 2; i < 10; i++) {
            temp.next = new ListNode(i);
            temp = temp.next;
        }

        for (temp = listNode; null != temp; temp = temp.next)
            System.out.print("=>" + temp.val);
        System.out.println();
        removeNthFromEnd(listNode, 3);
        for (temp = listNode; null != temp; temp = temp.next)
            System.out.print("=>" + temp.val);

    }

}
