package my;

import org.junit.Test;

/**
 * Created by Ilovezilian on 2017/6/22.
 */
public class argumentsDemoText {
    @Test
    public void pastArgumentsTest() {
        printArguments(1);
        printArguments(1,2);
        printArguments(1,2,3);
    }

    public void printArguments(int... number) {
        int i = 0;
        for(int item: number){
            System.out.print(++i +" " +  item + "   ");
        }
        System.out.println("\n-----------------------------------------");
    }


}
