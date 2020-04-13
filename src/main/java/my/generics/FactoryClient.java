package my.generics;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class FactoryClient {
    public <T extends Pair> void select1(Factory<T> factory, String statement) { }
    public <T> Collection<T> select(Factory<T> factory, String statement) {
        Collection<T> result = new ArrayList<T>();

        /* Run sql query using jdbc */
        for (/* Iterate over jdbc results. */int i = 0; i < 2; i++) {
            T item = factory.make();
            /* Use reflection and set all of item's
             * fields from sql results.
             */
            result.add(item);
        }
        return result;
    }

}
