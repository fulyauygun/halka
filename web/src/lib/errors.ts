const CONTRACT_ERROR_MESSAGES: Record<string, string> = {
  InvalidMemberCount: "Bir halka en az 2 üyeden oluşmalı.",
  DuplicateMember: "Üye listesinde aynı adres birden fazla kez var.",
  InvalidPayoutOrder: "Ödeme sırası, üye listesinin bir permütasyonu olmalı.",
  InvalidAmount: "Katkı miktarı sıfırdan büyük olmalı.",
  InvalidTimeout: "Round süresi sıfırdan büyük olmalı.",
  CircleNotFound: "Bu halka bulunamadı.",
  CircleNotForming: "Bu halka artık katılıma açık değil (zaten aktif ya da tamamlanmış).",
  CircleNotActive: "Bu halka henüz aktif değil — tüm üyelerin katılması bekleniyor.",
  NotMember: "Bu adres bu halkanın üyesi değil.",
  AlreadyJoined: "Bu üye zaten katılmış.",
  AlreadyDepositedThisRound: "Bu round için zaten katkı payınızı yatırdınız.",
  RoundNotComplete: "Bu round için henüz tüm üyeler katkı yapmadı.",
  RoundNotTimedOut: "Bu round için geri çekme süresi henüz dolmadı.",
  NothingToReclaim: "Geri çekilecek bir katkınız yok.",
};

/** Maps a contract Error variant name (e.g. "NotMember") to a plain-language message. */
export function contractErrorMessage(name: string | undefined): string {
  if (!name) return "Bilinmeyen bir kontrat hatası oluştu.";
  return CONTRACT_ERROR_MESSAGES[name] ?? name;
}

/** Turns any thrown error (wallet rejection, network failure, contract
 * error) into a message safe to show the user directly. */
export function describeError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();

  if (lower.includes("user declined") || lower.includes("rejected")) {
    return "İşlem cüzdanda onaylanmadı.";
  }
  if (lower.includes("freighter") && lower.includes("not")) {
    return "Freighter cüzdan uzantısı bulunamadı. Lütfen freighter.app adresinden kurun.";
  }
  if (lower.includes("failed to fetch") || lower.includes("network")) {
    return "Ağ hatası — Stellar testnet'ine ulaşılamadı. Lütfen tekrar deneyin.";
  }

  for (const [name, message] of Object.entries(CONTRACT_ERROR_MESSAGES)) {
    if (raw.includes(name)) return message;
  }

  return raw;
}
