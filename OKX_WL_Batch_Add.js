
/*
OKX 白名单提现地址批量添加
原作者：by wx\tw: gggxin

V2修改版: @gm365

💬 使用方法：

1. 修改 wallet_address_csv 为你自己的地址

2.进入批量添加入口,点击新增提币地址,比如添加Eth的提现
https://www.okx.com/cn/balance/withdrawal-address/eth/2 

3. 页面上选择 提币网络

4. 打开开发者⼯具, 复制该文件所有代码, 在 Chrome 控制台里运行

5. 提交地址，一切操作完毕后，继续后续（如果地址数量大于20）

*/



// 以下备注、地址修改成自己要添加的钱包地址信息
// 英文逗号分隔，左侧为地址备注，右侧为地址


// 用户输入的逗号分隔数据
let wallet_address_csv = `
era_add_1,0x4F380975771A51dE4797419BC264c902B25408b01
era_add_2,0x2d3C2c6e08A07F4FeF5C7e0c134cC9033b1b6502
era_add_3,0x7F380975771A51dE4797419BC264c902B25408b03
era_add_4,0x1d3C2c6e08A07F4FeF5C7e0c134cC9033b1b6504
era_add_5,0x9F380975771A51dE4797419BC264c902B25408b05
era_add_6,0x6d3C2c6e08A07F4FeF5C7e0c134cC9033b1b6506
era_add_7,0x5F380975771A51dE4797419BC264c902B25408b07
era_add_8,0x3d3C2c6e08A07F4FeF5C7e0c134cC9033b1b6508
era_add_9,0x8F380975771A51dE4797419BC264c902B25408b09
era_add_10,0x0d3C2c6e08A07F4FeF5C7e0c134cC9033b1b650A
`;

// 转换为所需数据结构
let wallet_address = {};
wallet_address_csv.trim().split("\n").forEach(line => {
    let parts = line.split(",");
    wallet_address[parts[0].trim()] = parts[1].trim();
});


console.log('🎉 成功获取到待输入地址:', wallet_address); // 输出转换后的数据数量


// 询问用户当前批次
// 20个钱包为1组,添加第几组, 就输入数字几
let curr_group = prompt("请输入当前待处理的批次（默认为1）：", "1");
curr_group = parseInt(curr_group);
if (isNaN(curr_group) || curr_group <= 0) {
    console.error("输入无效！请输入正整数。");
    // 退出运行
} else {
    console.log(`🪧 选择的批次为：${curr_group}`);
}


let one_group_count = 20;
let wallet_address_keys = Object.keys(wallet_address);
let wallet_count = wallet_address_keys.length;
let add_count = wallet_count;

if (add_count > one_group_count) {
    add_count = one_group_count;
}

let group_start_index = (curr_group - 1) * one_group_count;
if ((wallet_count - group_start_index) < one_group_count) {
    add_count = wallet_count - group_start_index;
}

let sleep_time = 900;
let chain_table_inputs = undefined;

let add_max = add_count;
let current_index = 0;

// 用于重新输入第一项的地址
function reinputFirstAddress() {

    // 获取所有具有地址输入框的 div 元素
    let all_address_divs = chain_table_inputs.querySelectorAll("div.okui-form-item-control > div.okui-form-item-control-input > div.okui-form-item-control-input-content > div.okui-input > div.okui-input-box");

    // 选择第一个
    let first_address_div = all_address_divs[0];

    // 在该元素内部，找到具有 class 属性值为 "okui-input-input" 的 input 元素
    let first_address_input = first_address_div.querySelector("input.okui-input-input");

    // 检查是否找到了第一项的地址输入框
    if (!first_address_input) {
        console.error("未能找到第一项的地址输入框");
        return;
    }

    // 填充第一项的地址
    console.log("准备重新输入第一项地址", wallet_address[wallet_address_keys[0]]);
    comm_input_value(first_address_input, wallet_address[wallet_address_keys[0]]);
    first_address_input.dispatchEvent(new Event('input'));

    console.log("✅ 第一项地址重新输入完毕，请进行下一步。");
}



// V2 版本，可以正常运行，但在最后一步，需要重新回头输入第一项地址
function DepositAddressBook_add() {

    console.log('💪 准备点击添加地址按钮...')
    document.querySelector("div.okui-form-item-control div.okui-form-item-control-input-content > div.withdraw-book-list div.add-address-form-btn").click();

    // 获取 chain_table_inputs 的引用
    chain_table_inputs = document.querySelector("div.okui-form-item-control div.okui-form-item-control-input-content > div.withdraw-book-list");

    // 获取所有具有地址输入框的 div 元素
    let all_address_divs = chain_table_inputs.querySelectorAll("div.okui-form-item-control > div.okui-form-item-control-input > div.okui-form-item-control-input-content > div.okui-input > div.okui-input-box");

    // 填充当前地址和备注
    let address_index = 3 + current_index * 5;
    let remark_index = 5 + current_index * 5;

    let address_input = chain_table_inputs.querySelector("div:nth-child(" + address_index + ") > div.okui-form-item-control  input.okui-input-input");
    let remark_input = chain_table_inputs.querySelector("div:nth-child(" + remark_index + ") > div.okui-form-item-control  input.okui-input-input");

    // 填充地址
    console.log("准备输入地址:", wallet_address[wallet_address_keys[current_index + group_start_index]])
    comm_input_value(address_input, wallet_address[wallet_address_keys[current_index + group_start_index]]);
    address_input.dispatchEvent(new Event('input'));


    // 输入备注
    console.log("准备输入备注:", wallet_address_keys[current_index + group_start_index]);
    comm_input_value(remark_input, wallet_address_keys[current_index + group_start_index]);
    remark_input.dispatchEvent(new Event('input'));


    current_index++;
    add_max--;
    if (add_max === 0) {
        clearInterval(intervalId);
        console.log("✅ 全部输入完毕，准备重新输入第一项地址。");
        reinputFirstAddress(); // 调用重新输入第一项地址的函数
    }
    console.log(add_max);

}


const intervalId = setInterval(DepositAddressBook_add, sleep_time);

function comm_input_value(elmObj, value) {
    if (!elmObj) {
        console.error("输入元素为空！");
        return;
    }
    elmObj.focus();
    elmObj.setSelectionRange(0, elmObj.value.length);
    document.execCommand('delete', null, false);
    document.execCommand('inserttext', false, value);
}

