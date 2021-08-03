package my.collection;

import org.junit.Test;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class MapRemoveTest {
    @Test
    public void RemoveFromKeySet() {
        HashMap<String, String> map = new HashMap<>();
        map.put("1", "1");
        map.put("2", "2");
        map.put("3", "3");
        map.put("4", "4");


        System.out.println("map = " + map);
        map.remove("1");
        map.remove("3");
        map.remove("5");
        System.out.println("map = " + map);
        for (Map.Entry<String, String> entry : map.entrySet()) {
            String key = entry.getKey();
            if (Arrays.asList("1", "2", "3").contains(key)) {
                map.remove(key);
            }
        }

        // 这个方式有问题
//        for (String key : map.keySet()) {
//            if (Arrays.asList("1", "2", "3").contains(key)) {
//                map.remove(key);
//            }
//        }
    }
}
