package my.visitor;

import java.util.ArrayList;
import java.util.List;

public class VisitorPattern {
    public static void main(String[] args) {
        ObjectStruct struct = new ObjectStruct();
        struct.add(new ConcreteElementA());
        struct.add(new ConcreteElementB());
        struct.accept(new ConcreteVisitorA());
        System.out.println("------------------------");
        struct.accept(new ConcreteVisitorB());
    }
}

// 抽象访问类
interface Visitor {
    void visit(ConcreteElementA element);

    void visit(ConcreteElementB element);
}

// 具体访问类 A
class ConcreteVisitorA implements Visitor {

    @Override
    public void visit(ConcreteElementA element) {
        System.out.println("具体访问者A访问-》" + element.operationA());
    }

    @Override
    public void visit(ConcreteElementB element) {
        System.out.println("具体访问者A访问-》" + element.operationB());

    }
}

// 具体访问类 B
class ConcreteVisitorB implements Visitor {

    @Override
    public void visit(ConcreteElementA element) {
        System.out.println("具体访问者B访问-》" + element.operationA());
    }

    @Override
    public void visit(ConcreteElementB element) {
        System.out.println("具体访问者B访问-》" + element.operationB());
    }
}

// 抽象元素类
interface Element {
    void accept(Visitor visitor);
}

// 具体元素类 A
class ConcreteElementA implements Element {

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public String operationA() {
        return "具体元素A的操作";
    }
}

// 具体元素类 B
class ConcreteElementB implements Element {

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public String operationB() {
        return "具体元素B的操作";
    }
}

// 对象结构类
class ObjectStruct {
    List<Element> elements = new ArrayList<>();

    public void accept(Visitor visitor) {
        elements.forEach(element -> element.accept(visitor));
    }

    public void add(Element element) {
        if (!elements.contains(element)) {
            elements.add(element);
        }
    }

    public void remove(Element element) {
        elements.remove(element);
    }

}