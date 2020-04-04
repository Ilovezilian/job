package my.generics;

class EmpInfoFactory implements Factory<EmpInfo> {
    public EmpInfo make() {
        return new EmpInfo();
    }
}