

let OUTOBJ = {};//全局变量公共对象


//==================================================================
// 函数表达式转换成 把输入的中缀表达式转成后缀表达式
//==================================================================
{

    let Stack = function () { }

    Stack.prototype = {
        Init: function () {
            this.STACKMAX = 100;
            this.stack = new Array(this.STACKMACK);
            this.top = -1;
            return this.stack;
        },
        isEmpty: function () {
            if (this.top == -1) {
                return true;
            }
            else {
                return false;
            }
        },
        push: function (elem) {
            if (this.top == this.STACKMAX - 1) {
                return "";//栈满
            }
            else {
                this.top++;
                this.stack[this.top] = elem;
            }
        },
        pop: function () {
            if (this.top == -1) {
                // return "空栈,无法删除栈顶元素！";
                return "";
            }
            else {
                let x = this.stack[this.top];
                this.top--;
                return x;
            }
        },
        peek: function () {
            if (this.top != -1) {
                return this.stack[this.top];
            }
            else {
                // return "空栈，顶元素无返回值！";
                return "";
            }
        },
        Clear: function () {
            this.top = -1;
        },
        Length: function () {
            return this.top + 1;
        }
    }


    function getBackExpre(s) {

        let list = new Array();
        let op = new Stack();
        op.Init();
        //let num=str.match(/\d+(\.\d+)?/g);  

        let i = 0;
        while (i < s.length) {
            // for(let i=0; i<s.length;i++){
            let c = s.charAt(i);
            if (c >= '0' && c <= '9') {
                let s1 = s.substr(i);
                let m = s1.match(/\d+(\.\d+)?/g);
                if (m.length > 0) {
                    s1 = m[0];
                    list.push(s1);
                }

                i = i + s1.length;

                continue;
            } else if (c == '(') {
                op.push(c);
            } else if (c == ')') {
                let p = op.pop();
                while (p != '(') {
                    list.push(p);
                    p = op.pop();
                }
            } else if (c == '+' || c == '-') {
                while (!op.isEmpty() && (op.peek() == '+' || op.peek() == '-' || op.peek() == '*' || op.peek() == '/')) {
                    list.push(op.pop());
                }
                op.push(c);
            } else if (c == '*' || c == '/') {
                while (!op.isEmpty() && (op.peek() == '*' || op.peek() == '/')) {
                    list.push(op.pop());
                }
                op.push(c);
            }
            i++;
        }

        while (!op.isEmpty()) {
            list.push(op.pop());
        }

        return list;


    }
    function g(a, b, c) {
        let v = 0;
        a = parseFloat(a);
        b = parseFloat(b);

        switch (c) {
            case '+':
                v = a + b;
                break;
            case '-':
                v = a - b;
                break;
            case '*':
                v = a * b;
                break;
            case '/':
                v = a / b;
                break;
        }
        return v;

    }
    function getResult(list, result) {

        for (let i = 0; i < list.length; i++) {

            if (!isNaN(list[i])) {
                result.push(list[i]);

            } else {
                let b = result.pop();
                let a = result.pop();
                let v = g(a, b, list[i]);

                result.push(v);

            }

        }
        return result.pop();

    }


    function isDot(num) {//判断是否有小数点
        var result = (num.toString()).indexOf(".");
        if (result != -1) {
            return true;//有
        } else {
            return false;//没有
        }
    }


    //str 为要输入的四则运算表达式，b为结果  


    OUTOBJ.strfun = function (str) {
        // let str = "1+2*(3+4+)"; //中缀表达式
        // console.log(str + '<br>');
        let list = getBackExpre(str);//后缀表达式
        console.log('后缀表达式' + list);
        let result = new Stack();
        result.Init();
        let b = getResult(list, result);
        b = parseFloat(b);

        // console.log(b);
        return isDot(b) ? b.toFixed(2) : b;
    }
}


//====================================================================
// 匹配括号的合法性
//===================================================================
{
    const validBraces = function (str) {
        // 匹配括号
        let brackets = str.match(/[\[\]\(\)\{\}]/g),
            arr = [],
            symbol;
        for (var i in brackets) {
            switch (brackets[i]) {
                case '(':
                    arr.push('(');
                    break;
                case '[':
                    arr.push('[');
                    break;
                case '{':
                    arr.push('{');
                    break;
                case ')':
                    symbol = arr.pop();
                    if (symbol !== '(') return false;
                    break;
                case ']':
                    symbol = arr.pop();
                    if (symbol !== '[') return false;
                    break;
                case '}':
                    symbol = arr.pop();
                    if (symbol !== '{') return false;
                    break

            }
        }
        // 当存在 (() 这样的情况时, 上面的都能通过, 最后需要检测一下arr的长度
        return arr.length > 0 ? false : true;
    }


    OUTOBJ.kuohao = validBraces;

}


export default OUTOBJ;