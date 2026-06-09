"use client"

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { Check, Download, FileUp, KeyRound, Plus, RefreshCcw, Search, ShieldBan, ShieldCheck } from "lucide-react"

import { ConfirmationModal } from "@/components/confirmation-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ApiError, accountApi } from "@/lib/api"
import type { Account, ConfirmImportAccountItem, ImportAccountError, ImportAccountPreviewItem, PasswordStatus } from "@/lib/api"
import { AUTH_ROLE_LABELS, AUTH_ROLES } from "@/lib/auth/constants"
import { getApiErrorMessage, getApiErrorMessageFromBackendMessage } from "@/lib/messages"

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
const ROLE_OPTIONS = [AUTH_ROLES.OPERATOR_ADMIN, AUTH_ROLES.OPERATOR_MANAGER, AUTH_ROLES.STATION_OPERATOR] as const
const CREATE_ROLE_OPTIONS = [AUTH_ROLES.OPERATOR_MANAGER, AUTH_ROLES.STATION_OPERATOR] as const

const PASSWORD_STATUS_LABELS: Record<PasswordStatus, string> = {
  NORMAL: "Normal",
  NEED_TO_CHANGE: "Must change",
  NEED_TO_RESET: "Reset required",
}

const PASSWORD_STATUS_CLASS_NAMES: Record<PasswordStatus, string> = {
  NORMAL: "border-emerald-200 bg-emerald-50 text-emerald-700",
  NEED_TO_CHANGE: "border-amber-200 bg-amber-50 text-amber-700",
  NEED_TO_RESET: "border-rose-200 bg-rose-50 text-rose-700",
}

const ACCOUNT_TABLE_CLASS_NAME = "border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40"

function formatDateTime(value?: string) {
  if (!value) return "--"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function accountCredentialText(username: string, temporaryPassword: string) {
  return `username: ${username}\npassword: ${temporaryPassword}`
}

function formatRoleNames(roles: string[]) {
  return roles.map((role) => AUTH_ROLE_LABELS[role as keyof typeof AUTH_ROLE_LABELS] ?? role).join(", ")
}

function isOperatorAdminAccount(account: Account) {
  return account.roles.includes(AUTH_ROLES.OPERATOR_ADMIN)
}

function canResetAccountPassword(account: Account) {
  return account.isActive && account.passwordStatus === "NEED_TO_RESET"
}

function AccountStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={isActive ? "rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700" : "rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600"}>
      {isActive ? "Active" : "Banned"}
    </span>
  )
}

function PasswordStatusBadge({ status }: { status: PasswordStatus }) {
  return (
    <span className={`rounded-md border px-2 py-1 text-xs font-medium ${PASSWORD_STATUS_CLASS_NAMES[status]}`}>
      {PASSWORD_STATUS_LABELS[status]}
    </span>
  )
}

export default function AccountManagementPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [keyword, setKeyword] = useState("")
  const [role, setRole] = useState("all")
  const [activeStatus, setActiveStatus] = useState("all")
  const [passwordStatus, setPasswordStatus] = useState("all")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tableError, setTableError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [createOpen, setCreateOpen] = useState(false)
  const [createUsername, setCreateUsername] = useState("")
  const [createRole, setCreateRole] = useState<string>(AUTH_ROLES.STATION_OPERATOR)
  const [createError, setCreateError] = useState("")
  const [createLoading, setCreateLoading] = useState(false)
  const [createdCredential, setCreatedCredential] = useState<{ username: string; temporaryPassword: string } | null>(null)

  const [importOpen, setImportOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const importFileInputRef = useRef<HTMLInputElement>(null)
  const [importLoading, setImportLoading] = useState(false)
  const [importError, setImportError] = useState("")
  const [importErrors, setImportErrors] = useState<ImportAccountError[]>([])
  const [importPreviewItems, setImportPreviewItems] = useState<ImportAccountPreviewItem[]>([])
  const [importPreviewSummary, setImportPreviewSummary] = useState<{ totalRows: number; validRows: number; invalidRows: number } | null>(null)
  const [importedAccounts, setImportedAccounts] = useState<ConfirmImportAccountItem[]>([])

  const [confirmAccount, setConfirmAccount] = useState<Account | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [resetAccount, setResetAccount] = useState<Account | null>(null)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState("")
  const [resetCredential, setResetCredential] = useState<{ username: string; temporaryPassword: string } | null>(null)
  const [copiedCredential, setCopiedCredential] = useState<"create" | "reset" | "import" | null>(null)

  const fromRow = totalElements === 0 ? 0 : page * pageSize + 1
  const toRow = Math.min((page + 1) * pageSize, totalElements)

  const loadAccounts = async (
    targetPage = page,
    filters?: { keyword: string; role: string; activeStatus: string; passwordStatus: string },
    targetPageSize = pageSize,
  ) => {
    setLoading(true)
    setTableError("")
    const currentKeyword = filters?.keyword ?? keyword
    const currentRole = filters?.role ?? role
    const currentActiveStatus = filters?.activeStatus ?? activeStatus
    const currentPasswordStatus = filters?.passwordStatus ?? passwordStatus

    try {
      const response = await accountApi.listAccounts({
        keyword: currentKeyword.trim() || undefined,
        role: currentRole === "all" ? undefined : currentRole,
        isActive: currentActiveStatus === "all" ? undefined : currentActiveStatus === "active",
        passwordStatus: currentPasswordStatus === "all" ? undefined : currentPasswordStatus,
        page: targetPage,
        size: targetPageSize,
      })

      setAccounts(response.result.items)
      setPage(response.result.page)
      setTotalElements(response.result.totalElements)
      setTotalPages(response.result.totalPages)
    } catch (error) {
      setTableError(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAccounts(0)
  }, [])

  const resetCreateForm = () => {
    setCreateUsername("")
    setCreateRole(AUTH_ROLES.STATION_OPERATOR)
    setCreateError("")
    setCreatedCredential(null)
  }

  const handleApplyFilters = () => {
    setSuccessMessage("")
    void loadAccounts(0)
  }

  const handleResetFilters = () => {
    const resetFilters = { keyword: "", role: "all", activeStatus: "all", passwordStatus: "all" }
    setKeyword("")
    setRole("all")
    setActiveStatus("all")
    setPasswordStatus("all")
    setSuccessMessage("")
    void loadAccounts(0, resetFilters)
  }

  const handlePageSizeChange = (value: string) => {
    const nextPageSize = Number(value)

    setPageSize(nextPageSize)
    setSuccessMessage("")
    void loadAccounts(0, undefined, nextPageSize)
  }

  const handleCreateAccount = async (event: FormEvent) => {
    event.preventDefault()

    if (!createUsername.trim()) {
      setCreateError("Vui lòng nhập username.")
      return
    }

    if (!createRole) {
      setCreateError("Vui lòng chọn role.")
      return
    }

    setCreateLoading(true)
    setCreateError("")

    try {
      const response = await accountApi.createAccount({
        username: createUsername.trim(),
        roleNames: [createRole],
      })
      const { temporaryPassword } = response.result

      if (!temporaryPassword) {
        setCreateError("Backend chưa trả mật khẩu tạm cho tài khoản vừa tạo.")
        return
      }

      setCreatedCredential({ username: response.result.username, temporaryPassword })
      setSuccessMessage("Tài khoản đã được tạo.")
      await loadAccounts(0)
    } catch (error) {
      setCreateError(getApiErrorMessage(error))
    } finally {
      setCreateLoading(false)
    }
  }

  const handleConfirmStatusChange = async () => {
    if (!confirmAccount) return

    setConfirmLoading(true)

    try {
      if (confirmAccount.isActive) {
        await accountApi.disableAccount(confirmAccount.id)
      } else {
        await accountApi.enableAccount(confirmAccount.id)
      }

      setSuccessMessage(confirmAccount.isActive ? "Tài khoản đã bị ban." : "Tài khoản đã được unban.")
      setConfirmAccount(null)
      await loadAccounts(page)
    } catch (error) {
      setTableError(getApiErrorMessage(error))
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!resetAccount) return

    setResetLoading(true)
    setResetError("")

    try {
      const response = await accountApi.resetAccountPassword({ username: resetAccount.username })
      setResetCredential({
        username: response.result.username,
        temporaryPassword: response.result.temporaryPassword,
      })
      setSuccessMessage("Mật khẩu tạm mới đã được tạo.")
      await loadAccounts(page)
    } catch (error) {
      setResetError(getApiErrorMessage(error))
    } finally {
      setResetLoading(false)
    }
  }

  const handleImportFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImportFile(event.target.files?.[0] ?? null)
    setImportError("")
    setImportErrors([])
    setImportPreviewItems([])
    setImportPreviewSummary(null)
    setImportedAccounts([])
  }

  const handleChooseAnotherImportFile = () => {
    setImportFile(null)
    setImportError("")
    setImportErrors([])
    setImportPreviewItems([])
    setImportPreviewSummary(null)
    setImportedAccounts([])

    if (importFileInputRef.current) {
      importFileInputRef.current.value = ""
      importFileInputRef.current.click()
    }
  }

  const handleOpenImportFilePicker = () => {
    importFileInputRef.current?.click()
  }

  const resetImportState = () => {
    setImportFile(null)
    setImportError("")
    setImportErrors([])
    setImportPreviewItems([])
    setImportPreviewSummary(null)
    setImportedAccounts([])
    setCopiedCredential((current) => current === "import" ? null : current)
  }

  const handlePreviewImportAccounts = async () => {
    if (!importFile) {
      setImportError("Vui lòng chọn file import.")
      return
    }

    setImportLoading(true)
    setImportError("")
    setImportErrors([])
    setImportPreviewItems([])
    setImportPreviewSummary(null)
    setImportedAccounts([])

    try {
      const response = await accountApi.previewImportAccounts(importFile)
      setImportPreviewSummary({
        totalRows: response.result.totalRows,
        validRows: response.result.validRows,
        invalidRows: response.result.invalidRows,
      })
      setImportPreviewItems(response.result.items)
      setImportErrors(response.result.errors)
    } catch (error) {
      if (error instanceof ApiError && error.response.result?.errors?.length) {
        setImportErrors(error.response.result.errors)
        setImportError("Preview import không thành công.")
      } else {
        setImportError(getApiErrorMessage(error))
      }
    } finally {
      setImportLoading(false)
    }
  }

  const handleConfirmImportAccounts = async () => {
    if (!importFile) {
      setImportError("Vui lòng chọn file import.")
      return
    }

    setImportLoading(true)
    setImportError("")

    try {
      const response = await accountApi.confirmImportAccounts(importFile)
      setImportedAccounts(response.result.items)
      setSuccessMessage("Import tài khoản hoàn tất.")
      await loadAccounts(0)
    } catch (error) {
      if (error instanceof ApiError && error.response.result?.errors?.length) {
        setImportErrors(error.response.result.errors)
        setImportError("File có lỗi nên chưa có account nào được tạo.")
      } else {
        setImportError(getApiErrorMessage(error))
      }
    } finally {
      setImportLoading(false)
    }
  }

  const handleDownloadTemplate = () => {
    const link = document.createElement("a")
    link.href = "/templates/account-import-template.xlsx"
    link.download = "account-import-template.xlsx"
    link.click()
  }

  const handleDownloadImportErrors = () => {
    const rows = ["row,field,error", ...importErrors.map((error) => `${error.row},${error.field},${getApiErrorMessageFromBackendMessage(error.message)}`)]
    downloadTextFile("account-import-errors.csv", rows.join("\n"))
  }

  const handleDownloadImportedAccounts = () => {
    const rows = [
      "username,password",
      ...importedAccounts.map((account) => `${account.username},${account.temporaryPassword}`),
    ]
    downloadTextFile("account-import-result.csv", rows.join("\n"))
  }

  const importedCredentialText = importedAccounts
    .map((account) => accountCredentialText(account.username, account.temporaryPassword))
    .join("\n\n")

  const handleCopyCredential = async (source: "create" | "reset", username: string, temporaryPassword: string) => {
    await navigator.clipboard.writeText(accountCredentialText(username, temporaryPassword))
    setCopiedCredential(source)
    window.setTimeout(() => setCopiedCredential((current) => current === source ? null : current), 1800)
  }

  const handleCopyImportedCredentials = async () => {
    await navigator.clipboard.writeText(importedCredentialText)
    setCopiedCredential("import")
    window.setTimeout(() => setCopiedCredential((current) => current === "import" ? null : current), 1800)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold text-foreground">Tài khoản nhân sự</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <FileUp className="h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => {
            resetCreateForm()
            setCreateOpen(true)
          }}>
            <Plus className="h-4 w-4" />
            Thêm tài khoản
          </Button>
        </div>
      </div>

      {successMessage && (
        <Alert>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm">Tất cả</Button>
        <Button variant="outline" size="sm" disabled>Của tôi</Button>
      </div>

      <div className="grid gap-3 border-b pb-4 md:grid-cols-[minmax(180px,1fr)_180px_160px_190px_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="pl-9" placeholder="Tìm username" />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả role</SelectItem>
            {ROLE_OPTIONS.map((roleName) => (
              <SelectItem key={roleName} value={roleName}>{AUTH_ROLE_LABELS[roleName]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={activeStatus} onValueChange={setActiveStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
        <Select value={passwordStatus} onValueChange={setPasswordStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Password status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả password</SelectItem>
            <SelectItem value="NORMAL">Normal</SelectItem>
            <SelectItem value="NEED_TO_CHANGE">Must change</SelectItem>
            <SelectItem value="NEED_TO_RESET">Reset required</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleApplyFilters} disabled={loading}>Lọc</Button>
        <Button variant="outline" onClick={handleResetFilters} disabled={loading}>Đặt lại</Button>
      </div>

      {tableError && (
        <Alert variant="destructive">
          <AlertDescription>{tableError}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <Table className={ACCOUNT_TABLE_CLASS_NAME}>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Password status</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Updated at</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Đang tải tài khoản...</TableCell>
              </TableRow>
            )}
            {!loading && accounts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Không có tài khoản phù hợp.</TableCell>
              </TableRow>
            )}
            {!loading && accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.username}</TableCell>
                <TableCell>{formatRoleNames(account.roles)}</TableCell>
                <TableCell><AccountStatusBadge isActive={account.isActive} /></TableCell>
                <TableCell><PasswordStatusBadge status={account.passwordStatus} /></TableCell>
                <TableCell>{formatDateTime(account.createdAt)}</TableCell>
                <TableCell>{formatDateTime(account.updatedAt)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {!isOperatorAdminAccount(account) && (
                      <Button variant={account.isActive ? "destructive" : "outline"} size="sm" onClick={() => setConfirmAccount(account)}>
                        {account.isActive ? <ShieldBan className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                        {account.isActive ? "Ban" : "Unban"}
                      </Button>
                    )}
                    {canResetAccountPassword(account) && (
                      <Button variant="outline" size="sm" onClick={() => setResetAccount(account)}>
                        <KeyRound className="h-4 w-4" />
                        Reset
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-3 border-t px-3 py-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>{fromRow}-{toRow} of {totalElements}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={loading || page <= 0} onClick={() => void loadAccounts(page - 1)}>Trước</Button>
            <span className="min-w-20 text-center">Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}</span>
            <Button variant="outline" size="sm" disabled={loading || page + 1 >= totalPages} onClick={() => void loadAccounts(page + 1)}>Sau</Button>
          </div>
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{createdCredential ? "Tài khoản đã được tạo" : "Tạo tài khoản"}</DialogTitle>
            <DialogDescription>{createdCredential ? "Mật khẩu tạm chỉ hiển thị một lần." : "Nhập thông tin tài khoản nhân sự vận hành."}</DialogDescription>
          </DialogHeader>
          {createdCredential ? (
            <div className="space-y-4">
              <div className="rounded-md border bg-muted/30 p-4 text-sm">
                <p><span className="text-muted-foreground">Username:</span> <span className="font-medium">{createdCredential.username}</span></p>
                <p><span className="text-muted-foreground">Mật khẩu tạm:</span> <span className="font-medium">{createdCredential.temporaryPassword}</span></p>
              </div>
              <p className="text-sm text-muted-foreground">User phải đổi mật khẩu sau khi đăng nhập.</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => void handleCopyCredential("create", createdCredential.username, createdCredential.temporaryPassword)}>
                  {copiedCredential === "create" && <Check className="h-4 w-4" />}
                  {copiedCredential === "create" ? "Đã copy" : "Copy username/password"}
                </Button>
                <Button onClick={() => {
                  setCreateOpen(false)
                  resetCreateForm()
                }}>Đóng</Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              {createError && <Alert variant="destructive"><AlertDescription>{createError}</AlertDescription></Alert>}
              <div className="space-y-2">
                <Label htmlFor="createUsername">Username</Label>
                <Input id="createUsername" value={createUsername} onChange={(event) => {
                  setCreateUsername(event.target.value)
                  setCreateError("")
                }} autoComplete="off" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={createRole} onValueChange={setCreateRole}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CREATE_ROLE_OPTIONS.map((roleName) => <SelectItem key={roleName} value={roleName}>{AUTH_ROLE_LABELS[roleName]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" disabled={createLoading} onClick={() => setCreateOpen(false)}>Hủy</Button>
                <Button type="submit" disabled={createLoading}>{createLoading ? "Đang lưu..." : "Lưu"}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={importOpen} onOpenChange={(open) => {
        setImportOpen(open)
        if (!open) resetImportState()
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import tài khoản</DialogTitle>
            <DialogDescription>Validate toàn bộ file trước khi tạo tài khoản.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {importError && <Alert variant="destructive"><AlertDescription>{importError}</AlertDescription></Alert>}
            {importPreviewSummary && (
              <Alert>
                <AlertDescription>
                  Tổng dòng: {importPreviewSummary.totalRows} | Hợp lệ: {importPreviewSummary.validRows} | Lỗi: {importPreviewSummary.invalidRows}
                </AlertDescription>
              </Alert>
            )}
            {importedAccounts.length > 0 && (
              <Alert>
                <AlertDescription>
                  Import hoàn tất. Tạo thành công: {importedAccounts.length}. Mật khẩu tạm chỉ hiển thị một lần.
                </AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input ref={importFileInputRef} type="file" accept=".xlsx" onChange={handleImportFileChange} className="hidden" />
              {importPreviewItems.length === 0 && importedAccounts.length === 0 && (
                <Button type="button" variant="outline" onClick={handleOpenImportFilePicker}>
                  <FileUp className="h-4 w-4" />
                  Chọn file
                </Button>
              )}
              <Button type="button" variant="outline" onClick={handleDownloadTemplate}>
                <Download className="h-4 w-4" />
                Tải template
              </Button>
              <span className="text-sm text-muted-foreground">{importFile?.name ?? "Chưa chọn file import."}</span>
            </div>
            {importPreviewItems.length === 0 && importedAccounts.length === 0 && (
              <div className="rounded-md border">
                <div className="border-b px-3 py-2 text-sm font-medium">Preview</div>
                <div className="p-3 text-sm text-muted-foreground">{importFile ? `File đã chọn: ${importFile.name}` : "Chưa chọn file import."}</div>
              </div>
            )}
            {importPreviewItems.length > 0 && importedAccounts.length === 0 && (
              <div className="rounded-md border">
                <Table className={ACCOUNT_TABLE_CLASS_NAME}>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Kết quả</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importPreviewItems.map((item) => (
                      <TableRow key={`${item.row}-${item.username}`}>
                        <TableCell>{item.row}</TableCell>
                        <TableCell>{item.username}</TableCell>
                        <TableCell>{item.roleName}</TableCell>
                        <TableCell>{item.valid ? "Hợp lệ" : item.errors.map((error) => getApiErrorMessageFromBackendMessage(error.message)).join(", ")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {importedAccounts.length > 0 && (
              <div className="rounded-md border">
                <Table className={ACCOUNT_TABLE_CLASS_NAME}>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Mật khẩu tạm</TableHead>
                      <TableHead>Kết quả</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importedAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>{account.username}</TableCell>
                        <TableCell>{formatRoleNames(account.roles)}</TableCell>
                        <TableCell>{account.temporaryPassword}</TableCell>
                        <TableCell>Created</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {importErrors.length > 0 && importedAccounts.length === 0 && (
              <div className="space-y-3">
                <Alert variant="destructive"><AlertDescription>File có lỗi nên chưa có account nào được tạo.</AlertDescription></Alert>
                <Table className={ACCOUNT_TABLE_CLASS_NAME}>
                  <TableHeader>
                    <TableRow><TableHead>Row</TableHead><TableHead>Field</TableHead><TableHead>Lỗi</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {importErrors.map((error, index) => (
                      <TableRow key={`${error.row}-${error.field}-${index}`}><TableCell>{error.row}</TableCell><TableCell>{error.field}</TableCell><TableCell>{getApiErrorMessageFromBackendMessage(error.message)}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <DialogFooter>
            {importedAccounts.length > 0 && (
              <>
                <Button variant="outline" onClick={() => void handleCopyImportedCredentials()}>
                  {copiedCredential === "import" && <Check className="h-4 w-4" />}
                  {copiedCredential === "import" ? "Đã copy" : "Copy danh sách username/password"}
                </Button>
                <Button variant="outline" onClick={handleDownloadImportedAccounts}>Download CSV</Button>
              </>
            )}
            {importErrors.length > 0 && importedAccounts.length === 0 && <Button variant="outline" onClick={handleDownloadImportErrors}>Tải báo cáo lỗi</Button>}
            {importPreviewItems.length > 0 && importedAccounts.length === 0 && <Button variant="outline" disabled={importLoading} onClick={handleChooseAnotherImportFile}>Chọn file khác</Button>}
            <Button variant="outline" disabled={importLoading} onClick={() => setImportOpen(false)}>{importedAccounts.length > 0 ? "Đóng" : "Hủy"}</Button>
            {importPreviewItems.length === 0 && importedAccounts.length === 0 && (
              <Button disabled={importLoading} onClick={handlePreviewImportAccounts}>{importLoading ? "Đang preview..." : "Preview"}</Button>
            )}
            {importPreviewItems.length > 0 && importedAccounts.length === 0 && (
              importErrors.length > 0
                ? <Button disabled={importLoading || !importFile} onClick={handlePreviewImportAccounts}>{importLoading ? "Đang preview..." : "Preview lại"}</Button>
                : <Button disabled={importLoading} onClick={handleConfirmImportAccounts}>{importLoading ? "Đang import..." : "Xác nhận import"}</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={Boolean(confirmAccount)}
        onOpenChange={(open) => {
          if (!open) setConfirmAccount(null)
        }}
        title={confirmAccount?.isActive ? `Ban tài khoản ${confirmAccount.username}` : `Unban tài khoản ${confirmAccount?.username ?? ""}`}
        description={confirmAccount?.isActive ? "Tài khoản này sẽ không thể đăng nhập hệ thống sau khi bị ban." : "Tài khoản này sẽ được phép đăng nhập lại nếu role và mật khẩu hợp lệ."}
        confirmText={confirmAccount?.isActive ? "Ban" : "Unban"}
        variant={confirmAccount?.isActive ? "destructive" : "default"}
        loading={confirmLoading}
        onConfirm={() => void handleConfirmStatusChange()}
      />

      <Dialog open={Boolean(resetAccount)} onOpenChange={(open) => {
        if (!open) {
          setResetAccount(null)
          setResetError("")
          setResetCredential(null)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{resetCredential ? "Mật khẩu tạm mới" : `Reset mật khẩu: ${resetAccount?.username ?? ""}`}</DialogTitle>
            <DialogDescription>{resetCredential ? "Mật khẩu tạm chỉ hiển thị một lần." : "Backend sẽ tạo mật khẩu tạm mới cho account đã gửi yêu cầu reset."}</DialogDescription>
          </DialogHeader>
          {resetCredential ? (
            <div className="space-y-4">
              <div className="rounded-md border bg-muted/30 p-4 text-sm">
                <p><span className="text-muted-foreground">Username:</span> <span className="font-medium">{resetCredential.username}</span></p>
                <p><span className="text-muted-foreground">Mật khẩu tạm:</span> <span className="font-medium">{resetCredential.temporaryPassword}</span></p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => void handleCopyCredential("reset", resetCredential.username, resetCredential.temporaryPassword)}>
                  {copiedCredential === "reset" && <Check className="h-4 w-4" />}
                  {copiedCredential === "reset" ? "Đã copy" : "Copy username/password"}
                </Button>
                <Button onClick={() => {
                  setResetAccount(null)
                  setResetCredential(null)
                }}>Đóng</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4">
              {resetError && <Alert variant="destructive"><AlertDescription>{resetError}</AlertDescription></Alert>}
              <DialogFooter>
                <Button variant="outline" disabled={resetLoading} onClick={() => setResetAccount(null)}>Hủy</Button>
                <Button disabled={resetLoading} onClick={() => void handleResetPassword()}><RefreshCcw className="h-4 w-4" />{resetLoading ? "Đang reset..." : "Reset mật khẩu"}</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

