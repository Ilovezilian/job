package my.generics;

import java.util.Collection;

public interface Assembly {
    // Returns a collection of Parts
//    Collection getParts();  // 这里是和下面getParts对照的
    // Returns a collection of Parts
    Collection<Part> getParts();
}
