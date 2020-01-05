package my;

import org.junit.Test;

/** 这里测试的是lable（标签的作用域）以及break、continue 添加label的作用。
 * Created by Ilovezilian on 2017/6/20.
 */
public class ForDemo {
    @Test
    public void breakWithLableTest() {
        int[][] arrayOfInts = {
                {32, 87, 3, 589},
                {12, 1076, 2000, 8},
                {622, 127, 77, 955}
        };
        int searchfor = 12;
        boolean foundIt = false;
        gigi:
        if (1 == 1)
            System.out.println("gigi");
        heihei:
        search: for (int i = 0; i < arrayOfInts.length; i++) {
            for (int j = 0; j < arrayOfInts[i].length; j++) {
                System.out.println("("+i+","+j+")");
                if (arrayOfInts[i][j] == 12){
                    foundIt = true;
                    break heihei;
                }
            }
        }
        if (foundIt){
            System.out.println("found " + searchfor);
        } else {
            System.out.println("not found " + searchfor);
        }
    }
}
