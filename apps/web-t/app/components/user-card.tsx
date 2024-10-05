
import { MobileIcon } from "@radix-ui/react-icons";
import {
    Edit,
    Fingerprint,
    Laptop,
    Loader2,
    LogOut,
    Plus,
    Trash,
    X
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { PasswordInput } from "~/components/ui/password-input";
import { authClient, signOut, user } from "~/lib/auth.client";
import { Session } from "~/lib/auth.types";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
// import QRCode from "react-qr-code";
// import CopyButton from "@/components/ui/copy-button";

export default function UserCard({ session, activeSessions }: { session: Session | null, activeSessions: Session["session"][] }) {

    const [ua, setUa] = useState<UAParser.UAParserInstance>();


    useEffect(() => {
        setUa(new UAParser(session?.session.userAgent));
    }, [session?.session.userAgent]);

    const [isTerminating, setIsTerminating] = useState<string>();


    const [isSignOut, setIsSignOut] = useState<boolean>(false);
    const [emailVerificationPending, setEmailVerificationPending] =
        useState<boolean>(false);
    return (
        <Card>
            <CardHeader>
                <CardTitle>User</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8 grid-cols-1">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="hidden h-9 w-9 sm:flex ">
                            <AvatarImage
                                src={session?.user.image || "#"}
                                alt="Avatar"
                                className="object-cover"
                            />
                            <AvatarFallback>{session?.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">
                                {session?.user.name}
                            </p>
                            <p className="text-sm">{session?.user.email}</p>
                        </div>
                    </div>
                    <EditUserDialog session={session} />
                </div>

                {session?.user.emailVerified ? null : (
                    <Alert>
                        <AlertTitle>Verify Your Email Address</AlertTitle>
                        <AlertDescription className="text-muted-foreground">
                            Please verify your email address. Check your inbox for the
                            verification email. If you haven't received the email, click the
                            button below to resend.
                        </AlertDescription>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="mt-2"
                            onClick={async () => {
                                await authClient.sendVerificationEmail(
                                    {
                                        email: session?.user.email || "",
                                    },
                                    {
                                        onRequest(context) {
                                            setEmailVerificationPending(true);
                                        },
                                        onError(context) {
                                            toast.error(context.error.message);
                                            setEmailVerificationPending(false);
                                        },
                                        onSuccess() {
                                            toast.success("Verification email sent successfully");
                                            setEmailVerificationPending(false);
                                        },
                                    },
                                );
                            }}
                        >
                            {emailVerificationPending ? (
                                <Loader2 size={15} className="animate-spin" />
                            ) : (
                                "Resend Verification Email"
                            )}
                        </Button>
                    </Alert>
                )}

                <div className=" w-max gap-1 flex flex-col">
                    <p className="text-xs font-medium ">Active Sessions</p>
                    {activeSessions
                        .filter((session) => session.userAgent)
                        .map((session) => {
                            return (
                                <div key={session.id}>
                                    <div className="flex items-center gap-2 text-sm  text-black font-medium dark:text-white">
                                        {new UAParser(session.userAgent).getDevice().type ===
                                            "mobile" ? (
                                            <MobileIcon />
                                        ) : (
                                            <Laptop size={16} />
                                        )}
                                        <Suspense fallback={<div>Loading...</div>}>
                                        {new UAParser(session.userAgent).getOS().name},{" "}
                                        {new UAParser(session.userAgent).getBrowser().name}
                                        </Suspense>
                                        <button
                                            className="text-red-500 opacity-80  cursor-pointer text-xs border-muted-foreground border-red-600  underline "
                                            onClick={async () => {
                                                setIsTerminating(session.id);
                                                const res = await authClient.user.revokeSession({
                                                    id: session.id,
                                                });

                                                if (res.error) {
                                                    toast.error(res.error.message);
                                                } else {
                                                    toast.success("Session terminated successfully");
                                                }
                                                // router.refresh();
                                                setIsTerminating(undefined);
                                            }}
                                        >
                                            {isTerminating === session.id ? (
                                                <Loader2 size={15} className="animate-spin" />
                                            ) : session.id === session?.id ? (
                                                "Sign Out"
                                            ) : (
                                                "Terminate"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>


                <div className="border-y py-4 flex items-center flex-wrap justify-between gap-2">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm">Passkeys</p>
                        <div className="flex gap-2 flex-wrap">
                            <AddPasskey />
                            {/* <ListPasskeys /> */}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="gap-2 justify-between items-center">
                <ChangePassword />
                <Button
                    className="gap-2 z-10"
                    variant="secondary"
                    onClick={async () => {
                        setIsSignOut(true);
                        await signOut({
                            fetchOptions: {
                                body: {
                                    callbackURL: "/",
                                },
                            },
                        });
                        setIsSignOut(false);
                    }}
                    disabled={isSignOut}
                >
                    <span className="text-sm">
                        {isSignOut ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <LogOut size={16} />
                                Sign Out
                            </div>
                        )}
                    </span>
                </Button>
            </CardFooter>
        </Card>
    );
}

async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [signOutDevices, setSignOutDevices] = useState<boolean>(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 z-10" variant="outline" size="sm">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M2.5 18.5v-1h19v1zm.535-5.973l-.762-.442l.965-1.693h-1.93v-.884h1.93l-.965-1.642l.762-.443L4 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L4 10.835zm8 0l-.762-.442l.966-1.693H9.308v-.884h1.93l-.965-1.642l.762-.443L12 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L12 10.835zm8 0l-.762-.442l.966-1.693h-1.931v-.884h1.93l-.965-1.642l.762-.443L20 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L20 10.835z"
                        ></path>
                    </svg>
                    <span className="text-sm text-muted-foreground">Change Password</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-11/12">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>Change your password</DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <PasswordInput
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="new-password"
                        placeholder="Password"
                    />
                    <Label htmlFor="new-password">New Password</Label>
                    <PasswordInput
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        placeholder="New Password"
                    />
                    <Label htmlFor="password">Confirm Password</Label>
                    <PasswordInput
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        placeholder="Confirm Password"
                    />
                    <div className="flex gap-2 items-center">
                        <Checkbox
                            onCheckedChange={(checked) =>
                                checked ? setSignOutDevices(true) : setSignOutDevices(false)
                            }
                        />
                        <p className="text-sm">Sign out from other devices</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={async () => {
                            if (newPassword !== confirmPassword) {
                                toast.error("Passwords do not match");
                                return;
                            }
                            if (newPassword.length < 8) {
                                toast.error("Password must be at least 8 characters");
                                return;
                            }
                            setLoading(true);
                            const res = await user.changePassword({
                                newPassword: newPassword,
                                currentPassword: currentPassword,
                                revokeOtherSessions: signOutDevices,
                            });
                            setLoading(false);
                            if (res.error) {
                                toast.error(
                                    res.error.message ||
                                    "Couldn't change your password! Make sure it's correct",
                                );
                            } else {
                                setOpen(false);
                                toast.success("Password changed successfully");
                                setCurrentPassword("");
                                setNewPassword("");
                                setConfirmPassword("");
                            }
                        }}
                    >
                        {loading ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            "Change Password"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function EditUserDialog(props: { session: Session | null }) {
    const [name, setName] = useState<string>();
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const [open, setOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2" variant="secondary">
                    <Edit size={13} />
                    Edit User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-11/12">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>Edit user information</DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        type="name"
                        // placeholder={session?.user?.name}
                        required
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="image">Profile Image</Label>
                        <div className="flex items-end gap-4">
                            {imagePreview && (
                                <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                                    <img
                                        src={imagePreview}
                                        alt="Profile preview"
                                        // objectFit="cover"
                                    />
                                </div>
                            )}
                            <div className="flex items-center gap-2 w-full">
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-muted-foreground"
                                />
                                {imagePreview && (
                                    <X
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setImage(null);
                                            setImagePreview(null);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        disabled={isLoading}
                        onClick={async () => {
                            setIsLoading(true);
                            await user.update({
                                image: image ? await convertImageToBase64(image) : undefined,
                                name: name ? name : undefined,
                                fetchOptions: {
                                    onSuccess: () => {
                                        toast.success("User updated successfully");
                                    },
                                    onError: (error: any) => {
                                        toast.error(error.error.message);
                                    },
                                },
                            });
                            setName("");
                            // router.refresh();
                            setImage(null);
                            setImagePreview(null);
                            setIsLoading(false);
                            setOpen(false);
                        }}
                    >
                        {isLoading ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            "Update"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function AddPasskey() {
    const [isOpen, setIsOpen] = useState(false);
    const [passkeyName, setPasskeyName] = useState("");
    // const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    const handleAddPasskey = async () => {
        if (!passkeyName) {
            toast.error("Passkey name is required");
            return;
        }
        setIsLoading(true);
        const res = await authClient.passkey.addPasskey({
            name: passkeyName,
        })
        if (res?.error) {
            console.log(res)
            toast.error(res?.error.message);
        } else {
            setIsOpen(false);
            toast.success("Passkey added successfully. You can now use it to login.");
        }
        setIsLoading(false);
    };
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-xs md:text-sm">
                    <Plus size={15} />
                    Add New Passkey
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-11/12">
                <DialogHeader>
                    <DialogTitle>Add New Passkey</DialogTitle>
                    <DialogDescription>
                        Create a new passkey to securely access your account without a
                        password.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <Label htmlFor="passkey-name">Passkey Name</Label>
                    <Input
                        id="passkey-name"
                        value={passkeyName}
                        onChange={(e) => setPasskeyName(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button
                        disabled={isLoading}
                        type="submit"
                        onClick={handleAddPasskey}
                        className="w-full"
                    >
                        {isLoading ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <>
                                <Fingerprint className="mr-2 h-4 w-4" />
                                Create Passkey
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// function ListPasskeys() {
//     const { data, error } = authClient.useListPasskeys();
//     const [isOpen, setIsOpen] = useState(false);
//     const [passkeyName, setPasskeyName] = useState("");

//     const handleAddPasskey = async () => {
//         if (!passkeyName) {
//             toast.error("Passkey name is required");
//             return;
//         }
//         setIsLoading(true);
//         const res = await authClient.passkey.addPasskey({
//             name: passkeyName,
//         });
//         setIsLoading(false);
//         if (res?.error) {
//             toast.error(res?.error.message);
//         } else {
//             toast.success("Passkey added successfully. You can now use it to login.");
//         }
//     };
//     const [isLoading, setIsLoading] = useState(false);
//     const [isDeletePasskey, setIsDeletePasskey] = useState<boolean>(false);
//     return (
//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//             <DialogTrigger asChild>
//                 <Button variant="outline" className="text-xs md:text-sm">
//                     <Fingerprint className="mr-2 h-4 w-4" />
//                     <span>Passkeys {data?.length ? `[${data?.length}]` : ""}</span>
//                 </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px] w-11/12">
//                 <DialogHeader>
//                     <DialogTitle>Passkeys</DialogTitle>
//                     <DialogDescription>List of passkeys</DialogDescription>
//                 </DialogHeader>
//                 {data?.length ? (
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Name</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {data.map((passkey) => (
//                                 <TableRow
//                                     key={passkey.id}
//                                     className="flex  justify-between items-center"
//                                 >
//                                     <TableCell>{passkey.name || "My Passkey"}</TableCell>
//                                     <TableCell className="text-right">
//                                         <button
//                                             onClick={async () => {
//                                                 const res = await authClient.passkey.deletePasskey({
//                                                     id: passkey.id,
//                                                     fetchOptions: {
//                                                         onRequest: () => {
//                                                             setIsDeletePasskey(true);
//                                                         },
//                                                         onSuccess: () => {
//                                                             toast("Passkey deleted successfully");
//                                                             setIsDeletePasskey(false);
//                                                         },
//                                                         onError: (error: any) => {
//                                                             toast.error(error.error.message);
//                                                             setIsDeletePasskey(false);
//                                                         },
//                                                     },
//                                                 });
//                                             }}
//                                         >
//                                             {isDeletePasskey ? (
//                                                 <Loader2 size={15} className="animate-spin" />
//                                             ) : (
//                                                 <Trash
//                                                     size={15}
//                                                     className="cursor-pointer text-red-600"
//                                                 />
//                                             )}
//                                         </button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 ) : (
//                     <p className="text-sm text-muted-foreground">No passkeys found</p>
//                 )}
//                 {!data?.length && (
//                     <div className="flex flex-col gap-2">
//                         <div className="flex flex-col gap-2">
//                             <Label htmlFor="passkey-name" className="text-sm">
//                                 New Passkey
//                             </Label>
//                             <Input
//                                 id="passkey-name"
//                                 value={passkeyName}
//                                 onChange={(e) => setPasskeyName(e.target.value)}
//                                 placeholder="My Passkey"
//                             />
//                         </div>
//                         <Button type="submit" onClick={handleAddPasskey} className="w-full">
//                             {isLoading ? (
//                                 <Loader2 size={15} className="animate-spin" />
//                             ) : (
//                                 <>
//                                     <Fingerprint className="mr-2 h-4 w-4" />
//                                     Create Passkey
//                                 </>
//                             )}
//                         </Button>
//                     </div>
//                 )}
//                 <DialogFooter>
//                     <Button onClick={() => setIsOpen(false)}>Close</Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }