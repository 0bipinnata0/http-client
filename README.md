```shell
201 created

// 对于已经存在的资源不应该使用POST请求
403 服务器已经理解，但是拒接执行 Forbidden

```



# 401 
## 1.client(客户端)发送请求到server(服务端), {server}
- 服务端的response的status设置为401 
- 将header添加WWW-Authenticate: Basic realm = "login"
> 如此能唤起浏览器的用户密码登录窗口

## 2.客户端输入username和password之后再次发起请求
- 客户端上次的request中header添加 `Authorization: Basic <base64(user:pass)>` 再次发起请求

## 3.验证通过之后服务端添加cookie相关header {server}
- response 的header添加`Set-Cookie: <cookie-name>=<cookie-value>`
> 成功为200, 失败为403

## 4.客户端自动玩头部添加cookie(HTTP是无状态的，cookie类似于状态的效果)
- request的header添加`Cookie: name=value; name2=value2; name3=value3`
