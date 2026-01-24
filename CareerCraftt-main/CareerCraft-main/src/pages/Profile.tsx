import { useEffect, useState } from "react";
import { User, Mail, Github, Link2, Save, Pencil } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface ProfileData {
  fullName: string;
  email: string;
  github: string;
  linkedin: string;
  targetRole: string;
  photoURL?: string;
}

const Profile = () => {
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    fullName: "",
    email: "",
    github: "",
    linkedin: "",
    targetRole: "",
    photoURL: ""
  });

  /* =========================
     LOAD FROM FIRESTORE
     ========================= */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Pre-fill email from Auth if profile is empty
        setProfile((prev) => ({ ...prev, email: user.email || "" }));

        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as ProfileData;
            // Merge with existing state to avoid overwriting with undefined if fields are missing
            setProfile((prev) => ({ ...prev, ...data }));
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast({
            variant: "destructive",
            title: "Error loading profile",
            description: "Could not fetch data from server.",
          });
        }
      }
    });

    return () => unsubscribe();
  }, [toast]);

  /* =========================
     SAVE TO FIRESTORE
     ========================= */
  const saveProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "You must be logged in to save your profile.",
      });
      return;
    }

    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, profile, { merge: true });

      setIsEditing(false);

      toast({
        title: "Profile updated",
        description: "Your profile has been saved to the cloud successfully.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Could not save changes to server.",
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Limit to 5MB
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfile(prev => ({ ...prev, photoURL: result }));
        setIsEditing(true); // Automatically switch to edit mode
        toast({
          title: "Photo updated",
          description: "Click 'Save Changes' to make it permanent.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex justify-center">
      <div className="max-w-6xl w-full space-y-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          My Profile
        </h1>

        <div className="bg-[#0f111a] border border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Background Glow Effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"></div>

          <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">

            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-6 w-full md:w-auto">
              <div className="w-64 h-64 rounded-full p-[3px] bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 shadow-lg shadow-purple-900/20">
                <div className="w-full h-full bg-black rounded-full overflow-hidden relative">
                  {profile.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        toast({ title: "Error loading image", variant: "destructive" });
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-900">
                      <User size={80} className="text-gray-600" />
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={!isEditing}
                />
                <label htmlFor="photo-upload">
                  <Button
                    variant="outline"
                    asChild
                    className={`
                      border-gray-700 bg-black/50 text-gray-300 hover:bg-gray-800 hover:text-white transition-all
                      ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <span>Change Photo</span>
                  </Button>
                </label>
              </div>
            </div>

            {/* Form Section */}
            <div className="flex-1 space-y-8 w-full">
              <div className="grid md:grid-cols-2 gap-8">

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                    <Input
                      className="pl-10 bg-[#0B1120] border-gray-800 focus:border-purple-500/50 text-gray-200 h-12 rounded-lg transition-all"
                      value={profile.fullName}
                      disabled={!isEditing}
                      placeholder="Your Name"
                      onChange={(e) =>
                        setProfile({ ...profile, fullName: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                    <Input
                      className="pl-10 bg-[#0B1120] border-gray-800 focus:border-purple-500/50 text-gray-200 h-12 rounded-lg transition-all"
                      value={profile.email}
                      disabled={true} // Email usually shouldn't be editable directly
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                {/* GitHub */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">GitHub</label>
                  <div className="relative group">
                    <Github className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                    <Input
                      className="pl-10 bg-[#0B1120] border-gray-800 focus:border-purple-500/50 text-gray-200 h-12 rounded-lg transition-all"
                      value={profile.github}
                      disabled={!isEditing}
                      placeholder="github-username"
                      onChange={(e) =>
                        setProfile({ ...profile, github: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">LinkedIn</label>
                  <div className="relative group">
                    <Link2 className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                    <Input
                      className="pl-10 bg-[#0B1120] border-gray-800 focus:border-purple-500/50 text-gray-200 h-12 rounded-lg transition-all"
                      value={profile.linkedin}
                      disabled={!isEditing}
                      placeholder="LinkedIn Profile Name/URL"
                      onChange={(e) =>
                        setProfile({ ...profile, linkedin: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Target Role */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Target Role</label>
                  <Input
                    className="bg-[#0B1120] border-gray-800 focus:border-purple-500/50 text-gray-200 h-12 rounded-lg transition-all"
                    value={profile.targetRole}
                    disabled={!isEditing}
                    placeholder="e.g. Software Engineer"
                    onChange={(e) =>
                      setProfile({ ...profile, targetRole: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 border-t border-gray-800/50 flex gap-4">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 hover:border-purple-500/50 transition-all"
                  >
                    <Pencil size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                      className="text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/20 transition-all"
                      onClick={saveProfile}
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </Button>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
