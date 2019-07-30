const server = new Server();
const inviteFunc = new InviteUserFunctions();
const projectFunc = new ProjectFunctions();
const newUserFunc = new NewUserFunctions();
const existingUsersFunc = new ExistingUsersFunctions();
const permissionsFunc = new PermissionsFunctions();
const newFolderFunc = new NewFolderFunctions();
const folderAddUsersFunc = new FolderAddUsersFunctions();
const uploadFileFunc = new UploadFileFunctions();
const renameFunc = new RenameFunctions();
const functionControl = new FunctionControl();

const inviteDisplay = new InviteUserContent();
const projectDisplay = new ProjectContent();
const newUserDisplay = new NewUserContent();
const existingUsersDisplay = new ExistingUsersContent();
const permissionsDisplay = new PermissionsContent();
const newFolderDisplay = new NewFolderContent();
const folderAddUsersDisplay = new FolderAddUsersContent();
const uploadFileDisplay = new UploadFileContent();
const renameDisplay = new RenameContent();
const contentControl = new ContentControl();
const modal = new Modal(contentControl,functionControl);




