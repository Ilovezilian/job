package my.fun;

public class ZigZagConversion {
    public static void main(String[] args) {
        System.out.println(new ZigZagConversion().convert("", 1));
    }

    /**
     * P  I  N
     * A LS IG
     * YA HR
     * P  I
     *
     * @param s
     * @param numRows
     * @return
     */

    public String convert(String s, int numRows) {
        StringBuffer sb = new StringBuffer();
        if (0 == numRows) {
            return "";
        }
        if (1 == numRows) {
            return s;
        }
        int gap = (numRows - 1) * 2;
        for (int j = 0; j < numRows; j++) {
            for (int i = 0; i < s.length(); i += gap) {
                if (i + j < s.length()) {
                    sb.append(s.charAt(i + j));
                }
                if (j != 0 && i - j + gap < s.length() && gap != j * 2) {
                    sb.append(s.charAt(i - j + gap));
                }
            }
        }
        return sb.toString();
    }
}
