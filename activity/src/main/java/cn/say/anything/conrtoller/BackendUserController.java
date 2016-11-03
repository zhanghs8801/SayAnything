package cn.say.anything.conrtoller;

import static cn.say.anything.tool.Constant.ADMIN_ROLE;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import cn.say.anything.bean.BackendUser;
import cn.say.anything.bean.Module;
import cn.say.anything.bean.QueryPageBean;
import cn.say.anything.service.BackendUserService;
import cn.say.anything.service.ModuleService;
import cn.say.anything.service.PermissionService;
import cn.say.anything.tool.Util;

@Controller
public class BackendUserController extends CommonController{
	private Logger logger = Logger.getLogger(BackendUserController.class);
	@Autowired
	private BackendUserService userService;
	@Autowired
	private ModuleService moduleService;
	@Autowired
	private PermissionService permService;

	/**
	 *用户列表
	 */
	@RequestMapping(value = "/users")
	@RequiresRoles(ADMIN_ROLE)
	public String users(BackendUser user, @RequestParam(value = "pageNum", required = false) String pageNum,@RequestParam(value = "pageSize", required = false) String pageSize,ModelMap model) {
		QueryPageBean<BackendUser> queryPageBean = userService.queryPageInfo(constractQueryPageInfo(pageNum, pageSize), user);
		model.put("queryPageBean", queryPageBean);
		model.put("user", user);
		return "/user/userlist";
	}
	
	/**
	 * 创建普通用户页面
	 */
	@RequestMapping(value = "/addUser")
	@RequiresRoles(ADMIN_ROLE)
	public String addUser(ModelMap model) throws Exception {
		List<Module> modules = moduleService.getModules();
		model.put("modules", modules);
		return "/user/addUserInput";
	}
	
	@RequestMapping(value = "/doAddUser")
	@RequiresRoles(ADMIN_ROLE)
	public void doAddUser(BackendUser user, String[] moduleId, HttpServletResponse res)throws IOException{
		JSONObject json = new JSONObject();
		try {
			if(Util.length(user.getUsername())>50){
				json.put("errorcode", 3);
				json.put("message", "用户名不能超过50个字符");
				outputJSON(res, json.toString());
				return;
			}
			
			List<BackendUser> users = userService.queryUserByName(user.getUsername());
			if(users!=null && users.size() > 0){
				json.put("errorcode", 2);
				json.put("message", "该用户名已存在!");
				outputJSON(res, json.toString());
				return;
			}
			userService.addUser(user, moduleId);
			json.put("errorcode", 0);
		} catch (Exception e) {
			logger.error("添加用户异常", e);
			json.put("errorcode", 1);
			json.put("message", "系统异常");
		}
		outputJSON(res, json.toString());
	}
	
	@RequestMapping(value="/updateUser")
	@RequiresRoles(ADMIN_ROLE)
	public String updateUser(ModelMap model,String id){
		BackendUser user = userService.getBeanById(Integer.parseInt(id));
		List<Module> modules = moduleService.getModules();
  		List<String> perms = null;
  		if(user.getRoleId() == 1){
  			perms = permService.getAllPermissions();
  		}else{
  			perms = permService.getPermissions(user.getUsername());
  		}
		model.put("user", user);
  		model.put("modules", modules);
  		model.put("perms", perms);
  		return "/user/updateUserInput";
	}
	
	@RequestMapping(value="/doUpdateUser")
	@RequiresRoles(ADMIN_ROLE)
	public void doUpdateUser(BackendUser user, String[] moduleId, HttpServletResponse res) throws IOException{
		JSONObject json = new JSONObject();
		try {
			if(Util.length(user.getUsername())>50){
				json.put("errorcode", 3);
				json.put("message", "用户名不能超过50个字符");
				outputJSON(res, json.toString());
				return;
			}
			userService.updateUser(user, moduleId);
			json.put("errorcode", 0);
		} catch (Exception e) {
			logger.error("更新用户异常", e);
			json.put("errorcode", 1);
			json.put("message", "系统异常");
		}
		outputJSON(res, json.toString());
	}
	
	@RequestMapping(value = "/deleteUser")
	@RequiresRoles(ADMIN_ROLE)
  	public String deleteUser(int id) throws Exception {
		userService.deleteBeanById(id);
  		return "redirect:/users";
  	}
}
