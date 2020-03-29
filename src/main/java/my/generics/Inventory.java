package my.generics;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class Inventory {
    /**
     * Adds a new Assembly to the inventory database.
     * The assembly is given the name name, and
     * consists of a set parts specified by parts.
     * All elements of the collection parts
     * must support the Part interface.
     **/
    private static Map<String, Collection> map = new ConcurrentHashMap<>();

    public static void addAssembly(String name, Collection parts) {
        map.put(name, parts);
    }

    public static Assembly getAssembly(String name) {
        return ()->map.get(name);
//        return new Assembly() {
//            @Override
//            public Collection getParts() {
//                return map.get(name);
//            }
//        };
    }
}
