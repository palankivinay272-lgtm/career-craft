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

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex justify-center">
      <div className="max-w-4xl w-full space-y-8">
        <h1 className="text-3xl font-bold text-purple-400">My Profile</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">

            {/* Avatar */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
                <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                  <User size={64} className="text-gray-400" />
                </div>
              </div>
              <Button variant="outline" disabled>
                Change Photo
              </Button>
            </div>

            {/* Form */}
            <div className="flex-1 space-y-6 w-full">
              <div className="grid md:grid-cols-2 gap-6">

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-500" size={16} />
                    <Input
                      className="pl-10 bg-black/40 border-gray-700"
                      value={profile.fullName}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setProfile({ ...profile, fullName: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-500" size={16} />
                    <Input
                      className="pl-10 bg-black/40 border-gray-700"
                      value={profile.email}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* GitHub */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">GitHub</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 text-gray-500" size={16} />
                    <Input
                      className="pl-10 bg-black/40 border-gray-700"
                      value={profile.github}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setProfile({ ...profile, github: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">LinkedIn</label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-3 text-gray-500" size={16} />
                    <Input
                      className="pl-10 bg-black/40 border-gray-700"
                      value={profile.linkedin}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setProfile({ ...profile, linkedin: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Target Role */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-gray-400">Target Role</label>
                  <Input
                    className="bg-black/40 border-gray-700"
                    value={profile.targetRole}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfile({ ...profile, targetRole: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-gray-800 flex gap-3">
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Pencil size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={saveProfile}
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </Button>
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
