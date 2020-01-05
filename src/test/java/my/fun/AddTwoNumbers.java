package my.fun;

public class AddTwoNumbers {
    public static void main(String[] args) {
        /**
         * [2,4,3]
         [5,6,4]
         */
        ListNode l1 = new ListNode(2);
        l1.next = new ListNode(4);
        l1.next.next = new ListNode(3);
        ListNode l2 = new ListNode(5);
        l2.next = new ListNode(6);
        l2.next.next = new ListNode(4);
        new AddTwoNumbers().addTwoNumbers(l1, l2);
    }

    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode retNode = null;
        ListNode tempNode = null;
        int a = -1;
        for (; null != l1 || null != l2;) {
            int var1 = null != l1 ? l1.val : 0;
            int var2 = null != l2 ? l2.val : 0;
            if (-1 == a) {
                retNode = new ListNode((var1 + var2) % 10);
                tempNode = retNode;
                a = (var1 + var2) / 10;
            } else {
                tempNode.next = new ListNode((var1 + var2 + a) % 10);
                tempNode = tempNode.next;
                a = (var1 + var2 + a) / 10;
            }
            l1 = null != l1 ? l1.next : null;
            l2 = null != l2 ? l2.next : null;
        }
        if (0 < a) {
            tempNode.next = new ListNode(a);
        }
        return retNode;
    }

    /**
     * error
     *
     * @param l1
     * @param l2
     * @return
     */
    public ListNode addTwoNumbers2(ListNode l1, ListNode l2) {
        ListNode retNode = null;
        ListNode tempNode = null;
        int a = -1;
        for (; null != l1; l1 = l1.next, l2 = l2.next) {
            if (-1 == a) {
                retNode = new ListNode((l1.val + l2.val) % 10);
                tempNode = retNode;
                a = (l1.val + l2.val) / 10;
            } else {
                tempNode.next = new ListNode((l1.val + l2.val + a) % 10);
                tempNode = tempNode.next;
                a = (l1.val + l2.val + a) / 10;
            }
        }
        if (0 < a) {
            tempNode.next = new ListNode(a);
        }
        return retNode;
    }

    /**
     * error
     *
     * @param l1
     * @param l2
     * @return
     */
    public ListNode addTwoNumbers1(ListNode l1, ListNode l2) {
        ListNode retNode = null;
        ListNode tempNode = null;
        int a = -1;
        for (; null != l1; l1 = l1.next, l2 = l2.next) {
            if (-1 == a) {
                retNode = new ListNode((l1.val + l2.val) % 10);
                tempNode = retNode;
                a = (l1.val + l2.val) / 10;
            } else {
                tempNode.next = new ListNode((l1.val + l2.val + a) % 10);
                tempNode = tempNode.next;
                a = (l1.val + l2.val + a) / 10;
            }
        }
        if (0 < a) {
            tempNode.next = new ListNode(a);
        }
        return retNode;
    }
}

class ListNode {
    int val;
    ListNode next;

    ListNode(int x) {
        val = x;
    }
}
