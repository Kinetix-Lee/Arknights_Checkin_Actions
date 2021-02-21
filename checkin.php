<!DOCTYPE html>
<html>
<head>
    <title>明日方舟签到-控制台</title>
    <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
    <style>body{background-color: #295d82;}div{ display:inline}</style>
</head>
<body>
<div id="return_btn" onclick="window.location.href='./index.html'"><img src="back.png"/></div><font size="6"> 控制台</font><br><br>
</body>
</html>
<?php
$HMAC_KEY = '91240f70c09a08a6bc72af1a5c8d4670';

$HOST_AUTH_SERVER = 'https://as.hypergryph.com';
$HOST_GAME_SERVER = 'https://ak-gs-gf.hypergryph.com';
$HOST_CONFIG_SERVER = 'https://ak-conf.hypergryph.com';

$COMMON_HEADER = array(
    'Content-Type: application/json',
    'X-Unity-Version: 2017.4.39f1',
    'User-Agent: Dalvik/2.1.0 (Linux; U; Android 6.0.1; X Build/V417IR)',
    'Connection: Keep-Alive'
);

$RES_VERSION = '';
$CLIENT_VERSION = '';
$NETWORK_VERSION = '5';

$MODULES = 1631;
$CHECKIN_ACTIVITY_ID = '';
$CHECKIN_ACTIVITY_ON = false;

$APP_ID = '1';
$CHANNEL_ID = '1';
$PLATFORM_ID = 'Android';//'IOS'
$PLATFORM = 1;
$SUB_CHANNEL = '1';
$WORLD_ID = '1';
class Player {
    var $device_id = ''; // 登录设备指纹, 注册账号时使用的唯一标识
    var $device_id2 = ''; // imei
    var $device_id3 = ''; // 登录设备指纹, 可为空
    var $account = ''; // 账号
    var $password = ''; // 密码
    var $uid = 0; // 当前账号唯一标识
    var $channel_uid = 0; // 渠道uid
    var $access_token = ''; // 游客登录凭据, 用来获取channel_uid
    var $token = ''; // 使用channel_uid和access_token换取的一次性登录凭据
    var $secret = ''; // http session_id, 标志客户端登录状态
    var $seqnum = 0; // 封包编号, 服务器会返回下一次请求使用的编号, 通常每次请求自增1
    var $login_time = 0; // syncData返回的服务器时间, 副本战斗日志加密时使用
    var $time_diff = 0; // 服务器与本地时间差
    var $can_checkin = true; // 是否可以签到
    var $can_receive_social_point = true; // 是否领取信用
    var $building_on = true; // 基建是否解锁
    var $activity_checkin_history = array(); // 活动签到历史
    var $manufacture_room_slot_id = array(); // 制造站
    var $trade_room_slot_id = array(); // 贸易站

    function get_device_id(){return $this->device_id;}
    function get_device_id2(){return $this->device_id2;}
    function get_device_id3(){return $this->device_id3;}
    function get_account(){return $this->account;}
    function set_account($account){$this->account = $account;}
    function get_password(){return $this->password;}
    function set_password($password){$this->password = $password;}
    function get_uid(){return $this->uid;}
    function set_uid($uid){$this->uid = $uid;}
    function get_channel_uid(){return $this->channel_uid;}
    function set_channel_uid($channel_uid){$this->channel_uid = $channel_uid;}
    function get_access_token(){return $this->access_token;}
    function set_access_token($access_token){$this->access_token = $access_token;}
    function get_token(){return $this->token;}
    function set_token($token){$this->token = $token;}
    function get_secret(){return $this->secret;}
    function set_secret($secret){$this->secret = $secret;}
    function get_seq(){return $this->seqnum;}
    function set_seq($seq){$this->seqnum=$seq;}
    function get_login_time(){return $this->login_time;}
    function set_login_time($login_time){$this->login_time=$login_time;}
    // 获取本地时间
    function get_local_time(){return time()+$this->time_diff;}
    // 本地时间校正
    function set_time_diff($server_time){$this->time_diff=$server_time-time();}
    function get_can_checkin(){return $this->can_checkin;}
    function set_can_checkin($can_checkin){$this->can_checkin=$can_checkin;}
    function get_can_receive_social_point(){return $this->can_receive_social_point;}
    function set_can_receive_social_point($can_receive_social_point){$this->can_receive_social_point=$can_receive_social_point;}
    function get_building_on(){return $this->building_on;}
    function set_building_on($building_on){$this->building_on=$building_on;}
    function get_activity_checkin_history(){return $this->activity_checkin_history;}
    function set_activity_checkin_history($history){$this->activity_checkin_history=$history;}
    function get_manufacture_room_slot_id(){return $this->manufacture_room_slot_id;}
    function set_manufacture_room_slot_id($room_slot_id){$this->manufacture_room_slot_id=$room_slot_id;}
    function get_trade_room_slot_id(){return $this->trade_room_slot_id;}
    function set_trade_room_slot_id($room_slot_id){$this->trade_room_slot_id=$room_slot_id;}

    function init($device_id, $device_id2 = '', $device_id3 = '', $access_token = ''){
        $this->device_id=$device_id;
        if ($device_id2) $this->device_id2=$device_id2;
        else $this->device_id2=get_random_device_id2();
        if ($device_id3) $this->device_id3=$device_id3;
        else $this->device_id3=get_random_device_id3();
        $this->access_token=$access_token;
    }
}

// main
if (empty($_POST['access_token'])){
    if (empty($_POST['account']) or empty($_POST['password'])){
        report_error('错误: 账号或密码不能为空');
    }
}
if (!empty($_POST['activity_id'])) $GLOBALS['CHECKIN_ACTIVITY_ID']=$_POST['activity_id'];
updata_config();
$player=new Player();
$player->init(get_random_device_id());
if (!empty($_POST['access_token'])){
    $player->set_access_token($_POST['access_token']);
}else{
    $player->set_account($_POST['account']);
    $player->set_password($_POST['password']);
}
play_login($player);


function play_login($player){
    if ($player->get_access_token()){
        // auth登录
        auth_login($player);
    } else{
        // 账号密码登录
        user_login($player);
    }
    sleep(1);

    // 获取token
    get_token($player);
    usleep(100000);
    // 登录游戏服务器
    game_login($player);
    usleep(100000);
    // 同步账号数据
    sync_data($player);
    usleep(100000);
    // 更新在线状态
    sync_status($player, $GLOBALS['MODULES']);
    usleep(100000);
    // 获取未完成订单
    get_unconfirmed_orderid_list($player);
    usleep(500000);

    // 每日签到
    if ($player->get_can_checkin()) checkin($player);
    usleep(100000);
    // 活动签到
    if ($GLOBALS['CHECKIN_ACTIVITY_ON']){
        $history=$player->get_activity_checkin_history();
        for ($i=0;$i<count($history);$i++){
            if ($history[$i]){
                activity_checkin($player,$GLOBALS['CHECKIN_ACTIVITY_ON'],$i);
            }
        }
    }
    usleep(100000);
    // 领取邮件|维护补偿
    $mail_list=get_meta_info_list($player);
    foreach($mail_list as $mail){
        recieve_mail($player,$mail->mailId,$mail->type);
        usleep(300000);
    }

    // 获取商店信用
    if ($player->get_can_receive_social_point()) receive_social_point($player);
    usleep(100000);
    // 同步基建数据
    sync_building($player);
    usleep(100000);
    if ($player->get_building_on()){
        // 获取制造站产物
        settle_manufacture($player);
        usleep(100000);
        // 递交贸易站订单
        delivery_batch_order($player);
        usleep(100000);
        // 获取基建干员信赖
        gain_all_intimacy($player);
    }else{
        report_normal("基建未解锁");
    }
}

// 功能函数声明:

// 获取客户端最新版本号
function updata_config(){
    $config=json_decode(get_from_conf("/config/prod/official/{$GLOBALS['PLATFORM_ID']}/version"));
    $GLOBALS['RES_VERSION']=$config->resVersion;
    $GLOBALS['CLIENT_VERSION']=$config->clientVersion;
}

// 同步账号数据
function sync_data($player){
    $data = json_encode(array('platform'=>1));
    $res=post_to_gs('/account/syncData',$data,$player);
    if ($res=='error'){
        report_error("活动签到错误: 连接错误");
    }else{
        $j=json_decode($res);
        $player->set_can_checkin($j->user->checkIn->canCheckIn?true:false);
        $player->set_can_receive_social_point($j->user->social->yesterdayReward->canReceive?true:false);
        if ($GLOBALS['CHECKIN_ACTIVITY_ON']){
            if (array_key_exists($GLOBALS['CHECKIN_ACTIVITY_ID'],$j->user->activity->CHECKIN_ONLY)){
                report_error("活动签到错误: activity_id不存在");
            } else{
                $player->set_activity_checkin_history($j->user->activity->CHECKIN_ONLY->$GLOBALS['CHECKIN_ACTIVITY_ID']->history);
            }
        }
        // 本地时间校正
        $player->set_time_diff($j->ts);
        // 记录玩家上线时间
        $player->set_login_time($j->user->event->status);
        report_normal("数据同步成功: uid:{$player->get_uid()}, 服务器时间:{$j->ts}");
        report_normal("登陆时间戳已保存: uid:{$player->get_uid()}, login_time:{$player->get_login_time()}");
    }
}
// 更新在线状态
function sync_status($player, $modules){
    $data = "{\"modules\":{$modules},\"params\":{\"16\":{\"goodIdMap\":{\"CASH\":[],\"ES\":[],\"GP\":[\"GP_Once_1\"],\"HS\":[],\"LS\":[],\"SOCIAL\":[]}}}}";
    $res=post_to_gs('/account/syncStatus',$data,$player);
    if ($res=='error'){
        report_error("状态同步失败: 连接错误");
    }else{
        $j=json_decode($res);
        report_normal("状态同步成功: uid:{$player->get_uid()}, 更新账号上线时间:{$j->ts}");
    }
}
// 同步基建数据
function sync_building($player){
    $res=post_to_gs('/building/sync',"{}",$player);
    if ($res=='error'){
        report_error("基建数据同步失败: 连接错误");
    }else{
        $manufacture_room_slot_id_list=array();
        $trade_room_slot_id_list=array();
        $j=json_decode($res);
        $j_rooms=$j->playerDataDelta->modified->building->rooms;
        if (array_key_exists('MANUFACTURE',$j_rooms) and array_key_exists('TRADING',$j_rooms)){
            foreach($j_rooms->MANUFACTURE as $key => $value){
                array_push($manufacture_room_slot_id_list,$key);
            }
            foreach($j_rooms->TRADING as $key => $value){
                array_push($trade_room_slot_id_list,$key);
            }
        }else{
            $player->set_building_on(false);
        }
        $player->set_manufacture_room_slot_id($manufacture_room_slot_id_list);
        $player->set_trade_room_slot_id($trade_room_slot_id_list);
        report_normal("基建数据同步成功: uid:{$player->get_uid()}");
    }
}

// 账号密码登录
function user_login($player){
    $account=$player->get_account();
    $deviceId=$player->get_device_id();
    $password=$player->get_password();
    $sign_data="account={$account}&deviceId={$deviceId}&password={$password}&platform={$GLOBALS['PLATFORM']}";
    $sign=u8_sign($sign_data);
    $data = json_encode(array('account'=>$account,'password'=>$password,'deviceId'=>$deviceId,'platform'=>$GLOBALS['PLATFORM'],'sign'=>$sign));
    $res=post_to_as('/user/login',json_encode($data));
    if ($res=='error'){
        report_error("账号密码登录失败: 连接错误");
    }else{
        $j=json_decode($res);
        if ($j->result){
            report_error("账号密码登录失败: data={$data}, err_code={$j->result}");
            return;
        }
        $player->set_channel_uid($j->uid);
        $player->set_access_token($j->token);
        report_normal("账号密码登录成功: 账号:{$player->get_account()}, 密码:{$player->get_password()}, deviceId:{$player->get_device_id()}, channel_uid:{$j->uid}, access_token:{$j->token}");
    }
}
// auth登录
function auth_login($player){
    $sign=u8_sign("token={$player->get_access_token()}");
    $data = json_encode(array('token'=>$player->get_access_token(),'sign'=>$sign));
    $res=post_to_as('/user/auth', $data);
    if ($res=='error'){
        report_error("auth登录失败: 连接错误");
    }else{
        $j=json_decode($res);
        if (array_key_exists('error',$j)){
            report_error("auth登录失败: data={$data}, err_code={$res}");
            return;
        }
        $player->set_channel_uid($j->uid);
        report_normal("auth登录成功: channel_uid:{$j->uid}");
    }
}
// 获取token
function get_token($player){
    $deviceId=$player->get_device_id();
    $deviceId2=$player->get_device_id2();
    $deviceId3=$player->get_device_id3();
    $uid=$player->get_channel_uid();
    $access_token=$player->get_access_token();
    $sign_data="appId={$GLOBALS['APP_ID']}&channelId={$GLOBALS['CHANNEL_ID']}&deviceId={$deviceId}&deviceId2={$deviceId2}&deviceId3={$deviceId3}&extension={\"uid\":\"{$uid}\",\"access_token\":\"{$access_token}\"}&platform={$GLOBALS['PLATFORM']}&subChannel={$GLOBALS['SUB_CHANNEL']}&worldId={$GLOBALS['WORLD_ID']}";
    $sign=u8_sign($sign_data);
    $data = json_encode(array('appId'=>$GLOBALS['APP_ID'],
        'channelId'=>$GLOBALS['CHANNEL_ID'],
        'deviceId'=>$deviceId,
        'deviceId2'=>$deviceId2,
        'deviceId3'=>$deviceId3,
        'extension'=>"{\"uid\":\"{$uid}\",\"access_token\":\"{$access_token}\"}",
        'platform'=>$GLOBALS['PLATFORM'],
        'subChannel'=>$GLOBALS['SUB_CHANNEL'],
        'worldId'=>$GLOBALS['WORLD_ID'],
        'sign'=>$sign
    ));
    $res=post_to_as('/u8/user/getToken', $data);
    if ($res=='error'){
        report_error("获取token失败: 连接错误");
    }else{
        $j=json_decode($res);
        if ($j->result){
            report_error("获取token失败: data={$data}, err_code={$j->result}");
            return;
        }
        $player->set_uid($j->uid);
        $player->set_token($j->token);
        report_normal("获取token成功: uid:{$j->uid}, channel_uid:{$j->channelUid}, token:{$j->token}");
    }
}
// 登录游戏服务器
function game_login($player){
    if (!$GLOBALS['RES_VERSION'] or !$GLOBALS['CLIENT_VERSION']){
        report_error('登录失败: 获取客户端版本号失败');
        return;
    }
    $deviceId=$player->get_device_id();
    $deviceId2=$player->get_device_id2();
    $deviceId3=$player->get_device_id3();
    $uid=$player->get_uid();
    $token=$player->get_token();
    $data = json_encode(array('networkVersion'=>$GLOBALS['NETWORK_VERSION'],
        'uid'=>$uid,
        'token'=>$token,
        'assetsVersion'=>$GLOBALS['RES_VERSION'],
        'clientVersion'=>$GLOBALS['CLIENT_VERSION'],
        'platform'=>$GLOBALS['PLATFORM'],
        'deviceId'=>$deviceId,
        'deviceId2'=>$deviceId2,
        'deviceId3'=>$deviceId3
    ));
    $res=post_to_gs('/account/login', $data, $player);
    if ($res=='error'){
        report_error("登录失败: 连接错误");
    }else{
        $j=json_decode($res);
        if ($j->result){
            report_error("登录失败: data={$data}, err_code={$j->result}");
            return;
        }
        $player->set_secret($j->secret);
        report_normal("登录成功: uid={$player->get_uid()}, secret={$j->secret}");
    }
}


// 获取未完成订单
function get_unconfirmed_orderid_list($player){
    $res=post_to_gs('/account/syncData',"{}",$player);
    if ($res=='error'){
        report_error("获取未完成订单失败: 连接错误");
    }else{
        report_normal("获取未完成订单成功: uid:{$player->get_uid()}");
    }
}
// 查询邮件(返回未读邮件id/type列表)
function get_meta_info_list($player){
    $res=post_to_gs('/mail/getMetaInfoList',json_encode(array('from'=>$player->get_local_time())),$player);
    $unread_mail_list=array();
    if ($res=='error'){
        report_error("获取邮件列表失败: 连接错误");
    }else{
        $j=json_decode($res);
        $has_item = false;
        foreach($j->result as $mail){
            if ($mail->state==0){
                array_push($unread_mail_list,array("mailId"=>$mail->mailId,"type"=>$mail->type));
                if ($mail->hasItem) $has_item=true;
            }
        }
        $length=count($unread_mail_list);
        $has_item_string=$has_item?'是':'否';
        report_normal("成功获取邮件列表: uid:{$player->get_uid()}, 未读邮件数:{$length}, 是否有物品:{$has_item_string}");
    }
    return $unread_mail_list;
}
// 收邮件
function recieve_mail($player, $mail_id, $mail_type){
    $data = json_encode(array('type'=>$mail_type,'mailId'=>$mail_id));
    $res=post_to_gs('/mail/receiveMail',$data,$player);
    if ($res=='error'){
        report_error("邮件收取失败: 连接错误");
    }else{
        report_normal("邮件收取成功: uid:{$player->get_uid()}, 邮件id:{$mail_id}");
    }
}
// 每日签到
function checkin($player){
    $res=post_to_gs('/user/checkIn',"{}",$player);
    if ($res=='error'){
        report_error("每日签到失败: 连接错误");
    }else{
        report_normal("每日签到完成: uid:{$player->get_uid()}");
    }
}
// 活动签到
function activity_checkin($player, $activity_id, $index){
    $data = json_encode(array('index'=>$index,'activityId'=>$activity_id));
    $res=post_to_gs('/activity/getActivityCheckInReward',$data,$player);
    if ($res=='error'){
        report_error("活动签到失败: 连接错误");
    }else{
        report_normal("活动签到完成: uid:{$player->get_uid()}, 活动id:{$activity_id}, 当前签到次数:{$index}");
    }
}
// 收取制造站产物
function settle_manufacture($player){
    $data = json_encode(array('roomSlotIdList'=>$player->get_manufacture_room_slot_id(),'supplement'=>1));
    $res=post_to_gs('/building/settleManufacture',$data,$player);
    if ($res=='error'){
        report_error("收取制造站产物失败: 连接错误");
    }else{
        report_normal("收取制造站产物完成: uid:{$player->get_uid()}");
    }
}
// 结算贸易站订单
function delivery_batch_order($player){
    $data = json_encode(array('slotList'=>$player->get_trade_room_slot_id()));
    $res=post_to_gs('/building/deliveryBatchOrder',$data,$player);
    if ($res=='error'){
        report_error("结算贸易站订单失败: 连接错误");
    }else{
        $j=json_decode($res);
        $item_string='';
        $item_number=0;
        foreach($j->delivered as $room){
            foreach($room as $item) {
                $item_number++;
                $item_string .= "{$item->type}共{$item->count}个";
            }
        }
        report_normal("结算贸易站订单完成: uid:{$player->get_uid()}, 获得物品数: {$item_number}, 获得物品数据: {$item_string}");
    }
}
// 收取基建干员信赖
function gain_all_intimacy($player){
    $res=post_to_gs('/building/gainAllIntimacy',"{}",$player);
    if ($res=='error'){
        report_error("收取基建干员信赖失败: 连接错误");
    }else{
        $j=json_decode($res);
        report_normal("收取基建干员信赖完成: uid:{$player->get_uid()}, 共计干员数: {$j->assist}, 共计信赖数: {$j->normal}");
    }
}
// 领取信用
function receive_social_point($player){
    $res=post_to_gs('/social/receiveSocialPoint',"{}",$player);
    if ($res=='error'){
        report_error("领取信用失败: 连接错误");
    }else{
        $j=json_decode($res);
        $social_number=0;
        foreach($j->reward as $reward){
            if ($reward->id=="SOCIAL_PT"){
                $social_number=$reward->count;
            }
        }
        report_normal("领取信用完成: uid:{$player->get_uid()}, 获得信用数: {$social_number}");
    }
}

function get_from_conf($cgi,$retry=3, $sleep = 1){
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL =>  $GLOBALS['HOST_CONFIG_SERVER'].$cgi,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => $GLOBALS['COMMON_HEADER'],
    ));
    $output = false;
    while(($output === false) && ($retry--)){
        sleep($sleep);
        $output = curl_exec($curl);
    }
    if ($output === false) $output ='error';
    curl_close($curl);
    return $output;
}
function post_to_as($cgi, $data,$retry=3, $sleep = 1){
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS['HOST_AUTH_SERVER'].$cgi,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => $data,
        CURLOPT_HTTPHEADER => $GLOBALS['COMMON_HEADER'],
    ));
    $output = curl_exec($curl);
    while(($output === false) && ($retry--)){
        sleep($sleep);
        $output = curl_exec($curl);
    }
    curl_close($curl);
    if ($output === false) $output ='error';
    return $output;
}
function post_to_gs($cgi, $data,$player,$retry=3, $sleep = 1){
    $curl = curl_init();

    $headder_ex=array('uid: '.$player->get_uid(),'secret: '.$player->get_secret(),'seqnum: '.$player->get_seq());

    curl_setopt_array($curl, array(
        CURLOPT_URL => $GLOBALS['HOST_GAME_SERVER'].$cgi,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => $data,
        CURLOPT_HTTPHEADER =>array_merge($GLOBALS['COMMON_HEADER'],$headder_ex),
    ));
    $output = curl_exec($curl);
    while(($output === false) && ($retry--)){
        sleep($sleep);
        $output = curl_exec($curl);
    }
    curl_close($curl);
    if ($output === false) { return 'error';}
    list($hederStr,$contentStr)=explode("\r\n\r\n",$output,2);
    // 更新封包编号
    if (preg_match('/(?<=Seqnum:.)\d+/',$hederStr,$seqnum)){
        $player->set_seq((int)$seqnum[0]);
    }else{
        $player->set_seq($player->get_seq()+1);
    }
    return $contentStr;
}

// u8登录签名: 登录json参数按key从小到大排序;使用&连接;使用HMAC-SHA1算法
function u8_sign($data){return hash_hmac("sha1", $data,$GLOBALS['HMAC_KEY']);}
// 生成随机device_id
function get_random_device_id(){return md5(get_random_string(12));}
// 生成随机device_id2
function get_random_device_id2(){return '86'.get_random_digits(13);}
// 生成随机device_id3
function get_random_device_id3(){return md5(get_random_string(12));}

function report_normal($str){
    echo $str."<br>";
}
function report_error($str){
    echo "<font color=\"#FF0000\">".$str."<br></font>";
    exit("<br>"."中止程序");
}
function get_random_string($length){
    $str = array_merge(range(0,9),range('a','f'));
    shuffle($str);
    $str = implode('',array_slice($str,0,$length));
    return $str;
}
function get_random_digits($length){
    $str = '';
    for ($i=1;$i<$length;$i++) {
        $randcode = mt_rand(0,9);
        $str .= $randcode;
    }
    return $str;
}
?>