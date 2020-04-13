package my.collection;

import org.junit.Test;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.TreeMap;


public class TreeMapTest {
    @Test
    public void treeMapStringOrderTest() {
        Map<String, String> map = MyTreeMapUtils.generateStringTreeMap();

        map.forEach((key, v) -> System.out.println("key = " + key));
    }


}
