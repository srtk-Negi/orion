"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { MOCK_PLATFORMS } from "./mockPlatforms";
import { type SocialAccount } from "./page";

export default function PlatformsPage({
  connectedAccounts,
  onConnect,
  onDisconnect,
}: {
  connectedAccounts: SocialAccount[];
  onConnect: (provider: string, metadata: any) => Promise<void>;
  onDisconnect: (accountId: number) => Promise<void>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const getConnectedAccount = (provider: string) => {
    return connectedAccounts.find((acc) => acc.provider === provider);
  };

  // Filter platforms based on search
  const filteredPlatforms = MOCK_PLATFORMS.filter(
    (platform) =>
      platform.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      platform.provider.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Map filtered platforms to include connection status
  const platformsWithStatus = filteredPlatforms.map((platform) => {
    const account = getConnectedAccount(platform.provider);
    return {
      ...platform,
      connected: !!account,
      accountData: account,
    };
  });

  const connectedCount = connectedAccounts.length;

  const handleToggleConnection = async (
    platform: (typeof MOCK_PLATFORMS)[0],
  ) => {
    setLoading(platform.provider);
    try {
      const account = getConnectedAccount(platform.provider);

      if (account) {
        await onDisconnect(account.id);
      } else {
        await onConnect(platform.provider, platform.metadata);
      }
    } catch (error) {
      console.error("Error toggling connection:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-balance">
                Manage Your Accounts
              </h1>
              <p className="text-muted-foreground mt-2 text-lg text-pretty">
                Manage your revenue sources and sync settings
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 flex gap-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="bg-success h-2 w-2 rounded-full" />
              <span className="text-muted-foreground">
                {connectedCount} Connected
              </span>
            </div>
            {MOCK_PLATFORMS.length - connectedCount > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-600" />
                <span className="text-muted-foreground">
                  {MOCK_PLATFORMS.length - connectedCount} can be connected
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Platforms Grid */}
        {filteredPlatforms.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platformsWithStatus.map((platform) => {
              const isLoading = loading === platform.provider;

              return (
                <div
                  key={platform.provider}
                  className="bg-card rounded-lg border p-6 transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white">
                        {platform.providerName[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {platform.providerName}
                        </h3>
                        {platform.connected && (
                          <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Connected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {platform.connected && platform.accountData?.metadata ? (
                    <div className="mb-4 text-sm">
                      <p className="text-foreground font-medium">
                        {platform.accountData.metadata.accountName}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {platform.accountData.metadata.subscribers
                          ? `${platform.accountData.metadata.subscribers} subscribers`
                          : platform.accountData.metadata.followers
                            ? `${platform.accountData.metadata.followers} followers`
                            : ""}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground mb-4 text-sm">
                      Connect your {platform.providerName} account to get
                      started
                    </p>
                  )}

                  <button
                    onClick={() => handleToggleConnection(platform)}
                    disabled={isLoading}
                    className={`w-full rounded-md px-4 py-2 font-medium transition-colors ${
                      platform.connected
                        ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {isLoading
                      ? "Processing..."
                      : platform.connected
                        ? "Disconnect"
                        : "Connect"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <p className="text-lg font-medium">No platforms found</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Try adjusting your search
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
