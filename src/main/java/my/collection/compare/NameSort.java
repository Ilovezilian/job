package my.collection.compare;

import java.util.*;

public class NameSort {
    /**
     * [Karl Ng, Tom Rich, Jeff Smith, John Smith]
     * @param args
     */
    public static void main(String[] args) {
        Name[] nameArray = {
            new Name("John", "Smith"),
            new Name("Karl", "Ng"),
            new Name("Jeff", "Smith"),
            new Name("Tom", "Rich")
        };

        List<Name> names = Arrays.asList(nameArray);
        Collections.sort(names);
        System.out.println(names);
    }
}
