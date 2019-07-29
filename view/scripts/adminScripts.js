const server = new Server();
const inviteFunc = new InviteUserFunctions();
const projectFunc = new ProjectFunctions();
const newUserFunc = new NewUserFunctions();
const existingUsersFunc = new ExistingUsersFunctions();
const permissionsFunc = new PermissionsFunctions();
const newFolderFunc = new NewFolderFunctions();
const folderAddUsersFunc = new FolderAddUsersFunctions();
const functionControl = new FunctionControl(projectFunc,inviteFunc,newUserFunc,existingUsersFunc,permissionsFunc,newFolderFunc,folderAddUsersFunc);

const inviteDisplay = new InviteUserContent();
const projectDisplay = new ProjectContent();
const newUserDisplay = new NewUserContent();
const existingUsersDisplay = new ExistingUsersContent();
const permissionsDisplay = new PermissionsContent();
const newFolderDisplay = new NewFolderContent();
const folderAddUsersDisplay = new FolderAddUsersContent();
const contentControl = new ContentControl(projectDisplay,inviteDisplay,newUserDisplay,existingUsersDisplay,permissionsDisplay,newFolderDisplay,folderAddUsersDisplay);
const modal = new Modal(contentControl,functionControl);




