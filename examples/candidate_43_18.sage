# 43/18 candidate family
# x=i, y=j, y=x+2u, y=-x+2v

def candidate_43_18(n):
    n = ZZ(n)
    lines = []

    for i in range(-n, n + 1):
        lines.append((1, 0, -i))

    for j in range(-n, n + 1):
        lines.append((0, 1, -j))

    for u in range(-2*n, 2*n + 1):
        lines.append((-1, 1, -2*u))

    for v in range(-2*n, 2*n + 1):
        lines.append((1, 1, -2*v))

    return [normalize_projective_vector(L) for L in lines]

n = 6
A = candidate_43_18(n)
points, tk = intersection_data(A)
c1, c2 = log_chern_numbers(A, tk)
slope = chern_slope(A, tk)

print("n =", n)
print("d =", len(A))
print("t_k =", dict(sorted(tk.items())))
print("c1^2 =", c1)
print("c2 =", c2)
print("slope =", slope)
print("decimal =", decimal(slope, 30))
print("target limit =", QQ(43)/18)
